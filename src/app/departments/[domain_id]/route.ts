import { NextApiRequest } from "next";
import { mockData } from "../data";
export async function GET(
    _request: Request, 
    { params }: { params: { domain_id: string } }
) {
    const departments = mockData.filter(
        (dep) => dep.domain_id == params.domain_id
    )
    return Response.json(departments)
}