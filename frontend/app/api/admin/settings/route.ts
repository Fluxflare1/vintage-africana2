import { NextRequest } from "next/server";
import { proxy } from "../../_proxy";

export async function GET(req: NextRequest) {
  return proxy(req, "/api/admin/settings/");
}
export async function PUT(req: NextRequest) {
  return proxy(req, "/api/admin/settings/");
}
export async function PATCH(req: NextRequest) {
  return proxy(req, "/api/admin/settings/");
}
