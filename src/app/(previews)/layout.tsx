import GlobafinLetterHead from "@/components/preview/globafin-letterhead";
import { ReactNode } from "react";

export default function PreviewsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @page {
            size: A4;
            margin: 2.1cm 1.9cm 1.8cm 1.32cm;
          }
          body {
            background-color: #fff;
          }

          @page {
            @bottom-right {
              content: 'Page ' counter(page) ' of ' counter(pages);
              font-size: 10px;
              color: #666;
            }
          }

          @media print {
            .mb-20 {
              margin-bottom: 0;
            }
          }
        `,
        }}
      />
      <div className="bg-white">
        <GlobafinLetterHead />
        {children}
      </div>
    </>
  );
}
