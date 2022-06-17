import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import axios from "axios";
import { URL } from "url";

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    if (!process.env.WP_BASE_URL) {
        return {
            statusCode: 502,
            body: JSON.stringify({ error: "Wordpress base URL not found" })
        }
    }

    console.log(event)

    if (!event.queryStringParameters || !event.queryStringParameters["path"]) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "No path found in query string" })
        }
    }

    const startingSitePath = event.queryStringParameters["path"]

    const result = {
        url: await getRedirectLocation(startingSitePath)
    }

    return {
        statusCode: 200,
        body: JSON.stringify(result)
    }
}

async function getRedirectLocation(path: string): Promise<string> {
    const response = await axios.get(`${process.env.WP_BASE_URL}${path}`)

    if (response.status === 200) {
        return response.request.path
    }

    console.error("Call to wordpress did not produce a 200")
    console.log(response)

    throw new Error("Call to wordpress did not produce a 200");    
}