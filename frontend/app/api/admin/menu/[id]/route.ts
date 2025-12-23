import { NextRequest } from "next/server";
import { proxy } from "../../../_proxy";

export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  return proxy(req, `/api/admin/menus/${ctx.params.id}/`);
}
export async function PUT(req: NextRequest, ctx: { params: { id: string } }) {
  return proxy(req, `/api/admin/menus/${ctx.params.id}/`);
}
export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  return proxy(req, `/api/admin/menus/${ctx.params.id}/`);
}
