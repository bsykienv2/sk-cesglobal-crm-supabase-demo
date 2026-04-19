import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const metadata = {
  title: "Hướng Dẫn Sử Dụng - CRM Pro",
};

export default async function HelpPage() {
  const filePath = path.join(process.cwd(), "HUONG_DAN_SU_DUNG.md");
  let fileContent = "";
  try {
    fileContent = fs.readFileSync(filePath, "utf8");
  } catch (error) {
    fileContent = "Error loading help documentation. Vui lòng kiểm tra file HUONG_DAN_SU_DUNG.md.";
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-headline font-semibold text-near-black">
          Hướng Dẫn Sử Dụng
        </h1>
        <p className="text-stone-gray text-sm mt-1">
          Tài liệu hướng dẫn sử dụng và quản lý hệ thống CRM Pro. Mỗi lần có thay đổi về chức năng, tài liệu này sẽ được tự động cập nhật.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border-cream p-6 md:p-10">
        <div className="prose prose-stone max-w-none prose-headings:font-headline prose-a:text-terracotta hover:prose-a:text-coral prose-img:rounded-xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {fileContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
