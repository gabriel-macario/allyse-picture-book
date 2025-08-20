import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pageImageUrls, pageTexts } from "./links/links";

// Types
interface PageBase {
  id: number;
  text?: string;
  imageUrl?: string;
  images?: string[];
  textOnly?: boolean;
  tone?: "soft" | "dramatic";
  format?: "note" | "letter";
  additionalFooterClasses?: string
}

interface FooterProps {
  text?: string;
  additionalClasses?: string;
}

type PartialPageBase = Partial<PageBase>

const pages: PageBase[] = pageTexts.map((text, i) => {
  console.log(i)
  let infoToJoin: PartialPageBase;

  // Penultimate page is a letter
  if (i === pageTexts.length - 2) {
    infoToJoin = {
      textOnly: true,
      format: "letter",
    }
  }
  // Else if no image url, then it is a note
  else if (pageImageUrls[i].length === 0) {
    infoToJoin = {
      textOnly: true,
      tone: "soft",
      format: "note",
    }
  }
  // If imageUrl is an array
  else if (typeof pageImageUrls[i] === "object") {
    infoToJoin = {
      images: pageImageUrls[i]
    }
  }
  // else is regular picture page
  else {
    infoToJoin = {
      imageUrl: pageImageUrls[i]
    }
  }

  // Dramaticize certain page
  if (i === pageTexts.length - 6) {
    infoToJoin.additionalFooterClasses = `font-semibold`
  }
  else if (i === pageTexts.length - 5) {
    infoToJoin.additionalFooterClasses = `font-bold`
  } else if (i === pageTexts.length - 4) {
    infoToJoin.additionalFooterClasses = `font-extrabold`
  }

  const page: PageBase = Object.assign(infoToJoin, {
    id: i,
    text
  })

  return page;
})

// PageView component
const PageView: React.FC<{ page: PageBase }> = ({ page }) => {
  if (page.textOnly) {
    if (page.format === "letter") {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-rose-100">
          <div className="w-full max-w-[700px] h-full overflow-y-auto p-6 sm:p-10 text-left">
            <p className="whitespace-pre-line text-lg sm:text-xl leading-relaxed text-gray-800">
              {page.text}
            </p>
          </div>
        </div>
      );
    }

    // default to note style
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-pink-100">
        <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-2xl shadow bg-white/80">
          <p className="text-xl sm:text-2xl leading-relaxed text-gray-700 whitespace-pre-line text-center">
            {page.text}
          </p>
        </div>
      </div>
    );
  }

  if (page.images && page.images.length > 1) {
    return (
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-2 p-2 bg-black">
        {page.images.map((src, i) => (
          <div key={i} className="flex items-center justify-center overflow-hidden">
            <img
              src={src}
              alt=""
              className="max-w-full max-h-full object-contain"
              draggable={false}
            />
          </div>
        ))}
      </div>
    );
  }

  if (page.imageUrl) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <img
          src={page.imageUrl}
          alt=""
          className="max-w-full max-h-full w-auto h-auto object-contain"
          draggable={false}
        />
      </div>
    );
  }

  return null;
};

const Footer: React.FC<FooterProps> = ({ text, additionalClasses }) => {
  const className = `p-4 text-center bg-white/70 text-gray-800 text-base sm:text-lg ${additionalClasses}`

  return (
    <div className={`${className}`}>
      {text}
    </div>
  )
}

// Main App
const App: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const nextPage = () => setCurrent((c) => (c + 1 < pages.length ? c + 1 : c));
  const prevPage = () => setCurrent((c) => (c - 1 >= 0 ? c - 1 : c));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-rose-200">
      <div
        className="
    relative w-full max-w-3xl
    aspect-[3/4] sm:aspect-auto
    bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col
    h-auto sm:h-[80vh] sm:max-h-[80vh]
  "
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={pages[current].id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="relative flex-1"
          >
            <PageView page={pages[current]} />
          </motion.div>
        </AnimatePresence>

        {/* Footer only if not textOnly/letter */}
        {!(pages[current].textOnly) && <Footer text={pages[current].text} additionalClasses={pages[current].additionalFooterClasses} />}
      </div>

      <div className="flex gap-4 mt-4">
        {current !== 0 &&
          <button
            onClick={prevPage}
            className="px-4 py-2 rounded-lg bg-white shadow hover:bg-pink-50"
          >
            ← Prev
          </button>}
        {current < pages.length - 1 &&
          <button
            onClick={nextPage}
            className="px-4 py-2 rounded-lg bg-white shadow hover:bg-pink-50"
          >
            Next →
          </button>}
      </div>
    </div>
  );
};

export default App;
