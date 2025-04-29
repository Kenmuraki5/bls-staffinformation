package main

import (
	"bytes"
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"net/http"
	"path/filepath"
	"strings"

	"database/sql"
	"time"

	"github.com/rs/cors"
	"github.com/xuri/excelize/v2"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// Employee represents the employee table structure
type Employee struct {
	EmpID             string         `gorm:"column:emp_id;primaryKey" json:"empId,omitempty"`
	OrganizationID    string         `gorm:"column:organization_id" json:"organization_id"`
	BranchID          string         `gorm:"column:branch_id" json:"branch_id"`
	JobID             string         `gorm:"column:job_id" json:"job_id"`
	EnTitle           string         `gorm:"en_title" json:"en_title"`
	EnFirstName       string         `gorm:"en_first_name" json:"en_first_name"`
	EnLastName        string         `gorm:"en_last_name" json:"en_last_name"`
	Nickname          string         `gorm:"nickname" json:"nickname"`
	ThTitle           string         `gorm:"th_title" json:"th_title"`
	ThFirstName       string         `gorm:"th_first_name" json:"th_first_name"`
	ThLastName        string         `gorm:"th_last_name" json:"th_last_name"`
	ShortName         string         `gorm:"short_name" json:"short_name"`
	Email             string         `gorm:"email" json:"email"`
	LogonId           string         `gorm:"logon_id" json:"logon_id"`
	DerivativeTrader  string         `gorm:"derivative_trader" json:"derivative_trader"`
	DerivativeLicense string         `gorm:"derivative_license" json:"derivative_license"`
	SingleTrader      string         `gorm:"single_trader" json:"single_trader"`
	SingleLicense     string         `gorm:"single_license" json:"single_license"`
	OtherLicense      string         `gorm:"other_License" json:"other_license"`
	StartWorkingDate  time.Time      `gorm:"start_working_date" json:"start_working_date"`
	LastWorkingDate   sql.NullTime   `gorm:"last_working_date" json:"last_working_date"`
	EffectiveDate     sql.NullTime   `gorm:"effective_date" json:"effective_date"`
	CorporationTitle  string         `gorm:"corporation_title" json:"corporation_title"`
	ExtensionCode     string         `gorm:"extension_code" json:"extension_code"`
	DirectLine        string         `gorm:"direct_line" json:"direct_line"`
	CreatedAt         time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt         time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt         gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	PicturePath       string         `gorm:"picture_path" json:"picture_path"`
}

var db *gorm.DB

func initDB() {
	var err error
	dsn := "root:my-secret-bls@tcp(10.100.30.61:3306)/employee_bls?charset=utf8mb4&parseTime=True&loc=Local"
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}
}

func uploadEmployeeFileHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	err := r.ParseMultipartForm(10 << 20) // 10MB limit
	if err != nil {
		http.Error(w, "Could not parse multipart form", http.StatusBadRequest)
		return
	}

	file, handler, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Could not get file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	log.Printf("Uploaded File: %+v\n", handler.Filename)

	fileBytes, err := io.ReadAll(file)
	if err != nil {
		http.Error(w, "Unable to read uploaded file", http.StatusInternalServerError)
		return
	}

	ext := strings.ToLower(filepath.Ext(handler.Filename))

	var header []string
	var rows [][]string

	switch ext {
	case ".csv":
		header, rows, err = parseCSV(fileBytes)
	case ".xlsx":
		header, rows, err = parseXLSX(fileBytes)
	default:
		http.Error(w, "Unsupported file type", http.StatusBadRequest)
		return
	}

	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to parse file: %v", err), http.StatusBadRequest)
		return
	}

	if len(rows) == 0 {
		http.Error(w, "No employee data found", http.StatusBadRequest)
		return
	}

	var employees []*Employee
	for _, row := range rows {
		emp := mapRowToEmployee(header, row)
		if emp == nil {
			continue
		}
		employees = append(employees, emp)
	}

	if len(employees) == 0 {
		http.Error(w, "No valid employee records found", http.StatusBadRequest)
		return
	}

	// ✅ Batch Upsert ทั้งก้อน
	err = db.Clauses(clause.OnConflict{
		Columns: []clause.Column{{Name: "emp_id"}}, // Conflict ที่ emp_id
		DoUpdates: clause.AssignmentColumns([]string{
			"organization_id", "branch_id", "job_id",
			"en_title", "en_first_name", "en_last_name", "nickname",
			"th_title", "th_first_name", "th_last_name", "short_name",
			"email", "logon_id", "derivative_trader", "derivative_license",
			"single_trader", "single_license", "other_license",
			"start_working_date", "last_working_date", "effective_date",
			"corporation_title", "extension_code", "direct_line",
			"updated_at", // สำคัญ: อัปเดต updated_at ใหม่
		}),
	}).Create(&employees).Error

	if err != nil {
		log.Printf("Batch upsert failed: %v", err)
		http.Error(w, fmt.Sprintf("Batch upsert failed: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Successfully upserted %d employees", len(employees))
}
func parseCSV(data []byte) ([]string, [][]string, error) {
	reader := csv.NewReader(bytes.NewReader(data))
	records, err := reader.ReadAll()
	if err != nil {
		return nil, nil, err
	}
	if len(records) < 2 {
		return nil, nil, fmt.Errorf("CSV file has no data")
	}
	return records[0], records[1:], nil
}

func parseXLSX(data []byte) ([]string, [][]string, error) {
	f, err := excelize.OpenReader(bytes.NewReader(data))
	if err != nil {
		return nil, nil, err
	}
	sheetName := f.GetSheetName(0)
	rows, err := f.GetRows(sheetName)
	if err != nil {
		return nil, nil, err
	}
	if len(rows) < 2 {
		return nil, nil, fmt.Errorf("XLSX file has no data")
	}
	return rows[0], rows[1:], nil
}

func mapRowToEmployee(header, row []string) *Employee {
	if len(header) != len(row) {
		return nil
	}
	emp := &Employee{}

	for i, col := range header {
		val := strings.TrimSpace(row[i])
		switch col { // ❗ ไม่ต้อง strings.ToLower หรือ _ => ใช้ตรงๆตามชื่อ
		case "Staff ID":
			emp.EmpID = val
		case "Organization ID":
			emp.OrganizationID = val
		case "Branch ID":
			emp.BranchID = val
		case "Job ID":
			emp.JobID = val
		case "Eng Title":
			emp.EnTitle = val
		case "Eng FirstName":
			emp.EnFirstName = val
		case "Eng LastName":
			emp.EnLastName = val
		case "Nickname":
			emp.Nickname = val
		case "Th Title":
			emp.ThTitle = val
		case "Th FirstName":
			emp.ThFirstName = val
		case "Th LastName":
			emp.ThLastName = val
		case "ShortName":
			emp.ShortName = val
		case "Email":
			emp.Email = val
		case "LogonId":
			emp.LogonId = val
		case "picturePath":
			emp.PicturePath = val
		case "Derivative Trader":
			emp.DerivativeTrader = val
		case "Derivative License":
			emp.DerivativeLicense = val
		case "Single Trader":
			emp.SingleTrader = val
		case "Single License":
			emp.SingleLicense = val
		case "Other License":
			emp.OtherLicense = val
		case "StartWorkingDate":
			if val != "" && val != "-" {
				if t, err := time.Parse(time.RFC3339, val); err == nil {
					emp.StartWorkingDate = t
				}
			}
		case "LastWorkingDate":
			if val != "" && val != "-" {
				if t, err := time.Parse(time.RFC3339, val); err == nil {
					emp.LastWorkingDate.Valid = true
					emp.LastWorkingDate.Time = t
				}
			}
		case "EffectiveDate":
			if val != "" && val != "-" {
				if t, err := time.Parse(time.RFC3339, val); err == nil {
					emp.EffectiveDate.Valid = true
					emp.EffectiveDate.Time = t
				}
			}
		case "Corporation Title":
			emp.CorporationTitle = val
		case "ExtensionCode":
			emp.ExtensionCode = val
		case "DirectLine":
			emp.DirectLine = val
		}
	}

	if emp.EmpID == "" {
		return nil
	}

	return emp
}

func main() {

	initDB()

	// สร้าง mux ปกติ
	mux := http.NewServeMux()
	mux.HandleFunc("/upload-employee-file", uploadEmployeeFileHandler)

	// สร้าง CORS middleware
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"}, // หรือจะระบุ origin ที่อนุญาต เช่น http://localhost:3000
		AllowedMethods:   []string{"GET", "POST", "PUT", "OPTIONS", "DELETE"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	// เอา cors.WrapHandler ครอบ mux
	handler := c.Handler(mux)

	log.Println("Starting server on :9090")
	log.Fatal(http.ListenAndServe(":9090", handler))
}
