function splitJobTitles(jobTitle) {
  if (!jobTitle) return [];

  let parts = jobTitle.split("/").map(p => p.trim()); 
  if (parts.length !== 2) return [jobTitle];

  let titlesEn = parts[0].split(/, | and |(?= Acting)/).map(t => t.trim());
  for (let i = titlesEn.length - 1; i > 0; i--) {
    if (titlesEn.length > 1 && !titlesEn[i].includes("Acting")) {
      titlesEn[i] = "Acting Head of " + titlesEn[i];
    }
  }
  let titlesTh = parts[1].split(/, | และ|(?<= เเละ )/).map(t => t.trim().replace(" เเละ", ""));
  let result = [];

  for (let i = 0; i < Math.max(titlesEn.length, titlesTh.length); i++) {
    let engTitle = titlesEn[i] || "";
    let thaiTitle = titlesTh[i] || "";

    if (engTitle && thaiTitle) {
      thaiTitle = (i != 0 && !thaiTitle.includes("รักษาการหัวหน้าส่วน") && !thaiTitle.includes("หัวหน้าฝ่าย") && !thaiTitle.includes("หัวหน้าส่วนงาน")) ? "รักษาการหัวหน้าส่วน " + thaiTitle : thaiTitle;
      result.push(`${engTitle} / ${thaiTitle}`);
    }
    else if (engTitle) {
      result.push(`${engTitle} /`);
    }
    else if (thaiTitle) {
      result.push(`/ ${thaiTitle}`);
    }
  }

  return result;
}

let job1 = "Head of NIB Department 6, Acting Head of Wealth Management 2, Wealth Management 6, Information technology / หัวหน้าฝ่ายค้าหลักทรัพย์ 6, รักษาการหัวหน้าส่วน Wealth Management2, Wealth Management 6 เเละ เทคโนโลยีสารสนเทส";
let job2 = "Head of Internal Audit Department and Acting head of Compliance / หัวหน้าฝ่ายตรวจสอบภายในและรักษาการหัวหน้าฝ่ายกำกับการปฏิบัติงานยปฏิบัติการ";
let job3 = "Head of General Accounting Division / หัวหน้าส่วนงานบัญชีทั่วไปและภาษีอากร"
let job4 = "Head of Corporate Counsel & Investor Relations Department / หัวหน้าฝ่ายกฎหมายเเละนักลงทุนสัมพันธ์"
console.log(splitJobTitles(job1));
console.log(splitJobTitles(job3));
console.log(splitJobTitles(job4));
