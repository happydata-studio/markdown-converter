import type { RequestHandler } from "@sveltejs/kit";
//@ts-ignore
import pdf3md from "@opendocsg/pdf2md";
import { NodeHtmlMarkdown } from 'node-html-markdown'
import * as mammoth from "mammoth";
interface PDFPageResponse {
  pageNumber: number;
  text: string;
}
const nhm = new NodeHtmlMarkdown(
  /* options (optional) */ {},
  /* customTransformers (optional) */ undefined,
  /* customCodeBlockTranslators (optional) */ undefined
);


export const POST: RequestHandler = async ({ request }): Promise<any> => {
  const chunks = [];

  try {
    const fileType = request.headers.get("content-type") as string;
    
    if (!request.body)
      return { status: 500, body: { error: "An error occurred." } };

    //ts-ignore
    for await (const chunk of request.body as any) {
      chunks.push(chunk);
    }

    let markdown = "";
    const arrayBuffer = new Uint8Array(Buffer.concat(chunks)).buffer;
    console.log({fileType});
    if(fileType === "application/pdf") {
       markdown = await pdf3md(arrayBuffer)
    } else if (fileType.search("application/vnd.openxmlformats-officedocument.wordprocessingml.document") > -1 || fileType.search("word") > -1) {
      // Handle Doc
      const html = await (await mammoth.convertToHtml({buffer: Buffer.concat(chunks)})).value;
      markdown = nhm.translate(html);
    }

    return new Response(
      JSON.stringify({
        fileType,
        markdown
      })
    );
  } catch (err:any) {
    console.error(err);
    return new Response(
      JSON.stringify({
        error: err.message,
      }),
      {
        status: 500,
        statusText: err.message,
      }
    );
  }
};


