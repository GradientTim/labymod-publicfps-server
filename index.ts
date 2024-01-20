import {serve} from "bun";

const authToken: string = "PLEASE_OVERRIDE_THIS_WITH_A_SECRET_TOKEN_THANK_YOU";
let currentFps: number = 0;

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT",
    "Access-Control-Allow-Headers": "*",
};

serve({
    hostname: 'localhost',
    port: 9412,
    async fetch(request: Request): Promise<Response> {
        const method: string = request.method;
        // CORS http preflight
        if (method === "PUT") {
            return new Response(null, {
               status: 200,
               statusText: 'OK',
               headers: corsHeaders,
            });
        }
        if (method === "POST") {
            const token: string | null = request.headers.get("Authorization");
            if (token === null || token !== authToken) {
                return new Response(null, {
                    status: 401,
                    statusText: "Unauthorized",
                    headers: corsHeaders,
                });
            }
            try {
                const { fps } = await request.json() as { fps: number };
                currentFps = fps;
                return new Response(null, {
                    status: 204,
                    statusText: "No Content",
                    headers: corsHeaders,
                });
            } catch (error) {
                return new Response(null, {
                    status: 400,
                    statusText: "Bad Request",
                    headers: corsHeaders,
                });
            }
        }
        if (method === "GET") {
            return new Response(String(currentFps), {
                status: 200,
                statusText: "OK",
                headers: corsHeaders,
            });
        }
        return new Response(null, {
            status: 400,
            statusText: "Bad Request",
            headers: corsHeaders,
        });
    },
});