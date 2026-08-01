import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { v4 as uuidv4 } from "uuid";
import {
  GripVertical,
  Eye,
  X,
  Plus,
  ImageIcon,
  Bold,
  Italic,
  Underline,
  Link2,
  Trash2,
} from "lucide-react";
import api from "../common/apiClient";
import summaryApi from "../common/SummaryApi";

// NOTE: kept in sync with BlogDashboard.jsx's category list.
const categories = ["Wood Works", "Stone Works", "Traditional Art Works"];

// Matches the `type` enum on ContentSchema in the Blog model
const BLOCK_TYPES = [
  { type: "heading", label: "Heading" },
  { type: "text", label: "Paragraph" },
  { type: "list", label: "List" },
  { type: "image", label: "Image" },
  { type: "quote", label: "Quote" },
  { type: "code", label: "Code" },
  { type: "link", label: "Link" },
  { type: "proTip", label: "Pro Tip" },
  { type: "button", label: "Button" },
];

/* ─── Success Popup ────────────────────────────────────────────────── */
function SuccessPopup({ isOpen, onClose, isUpdate }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-8 text-center shadow-xl">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-[#5B2D07] mb-2">Success!</h2>
        <p className="text-[#0B1A35]/70">
          Blog post has been {isUpdate ? 'updated' : 'published'} successfully.
        </p>
        <button
          onClick={onClose}
          className="mt-6 rounded-lg bg-[#E29C15] hover:bg-[#C98B24] transition-colors px-6 py-2 text-sm font-semibold text-white"
        >
          OK
        </button>
      </div>
    </div>
  );
}

/* ─── Blog Preview Modal ──────────────────────────────────────────────── */
function BlogPreviewModal({ isOpen, onClose, form, blocks, featuredImagePreview }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#FDFBF7] border-b border-[#E29C15]/30 p-6 flex items-center justify-between z-10">
          <h2 className="font-serif text-xl text-[#5B2D07]">Blog Preview</h2>
          <button
            onClick={onClose}
            className="text-[#5B2D07] hover:text-[#5B2D07]/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Featured Image */}
          {featuredImagePreview ? (
            <img
              src={featuredImagePreview}
              alt={form.title}
              className="w-full h-96 object-cover rounded-lg mb-6"
            />
          ) : (
            <div className="w-full h-48 rounded-lg mb-6 bg-[#FDFBF7] border-2 border-dashed border-[#E29C15]/50 flex items-center justify-center text-[#0B1A35]/40 text-sm">
              No featured image selected
            </div>
          )}

          {/* Title */}
          <h1 className="font-serif text-4xl text-[#5B2D07] mb-4">
            {form.title || <span className="text-[#0B1A35]/40">Untitled blog</span>}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 text-sm text-[#2A190C80] mb-6 pb-6 border-b border-[#E29C15]/30">
            <span>
              By <strong className="text-[#0B1A35]">{form.author || "—"}</strong>
            </span>
            <span>
              Category: <strong className="text-[#0B1A35]">{form.category || "—"}</strong>
            </span>
            <span>
              Status:{" "}
              <strong className="capitalize text-[#0B1A35]">{form.status || "draft"}</strong>
            </span>
            {form.tags && (
              <span>
                Tags: <strong className="text-[#0B1A35]">{form.tags}</strong>
              </span>
            )}
          </div>

          {/* Content Blocks */}
          <div className="prose prose-lg max-w-none text-[#0B1A35]">
            {blocks.length === 0 ? (
              <p className="text-[#0B1A35]/50 italic">No content blocks added yet.</p>
            ) : (
              blocks.map((block, index) => {
                const imageSrc =
                  block.preview || block._existingImageUrl || block.imageurl?.url || null;

                return (
                  <div key={block.id || index} className="mb-6">
                    {block.type === "heading" && (
                      <div
                        className={`font-serif text-[#5B2D07] mb-4 ${
                          { h1: "text-4xl", h2: "text-3xl", h3: "text-2xl", h4: "text-xl" }[
                            block.level
                          ] || "text-3xl"
                        }`}
                      >
                        {block.text || (
                          <span className="text-[#0B1A35]/40 text-base font-sans">
                            Empty heading
                          </span>
                        )}
                      </div>
                    )}

                    {block.type === "text" && (
                      <div className="text-[#0B1A35] leading-relaxed mb-4">
                        {block.text ? (
                          <div dangerouslySetInnerHTML={{ __html: block.text }} />
                        ) : (
                          <p className="text-[#0B1A35]/40 italic">Empty paragraph</p>
                        )}
                      </div>
                    )}

                    {block.type === "list" && (
                      <div className="mb-4">
                        {(block.items || []).filter(Boolean).length === 0 ? (
                          <p className="text-[#0B1A35]/40 italic">Empty list</p>
                        ) : block.style === "bullet" ? (
                          <ul className="list-disc list-inside space-y-2">
                            {(block.items || []).map((item, i) => (
                              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                            ))}
                          </ul>
                        ) : (
                          <ol className="list-decimal list-inside space-y-2">
                            {(block.items || []).map((item, i) => (
                              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                            ))}
                          </ol>
                        )}
                      </div>
                    )}

                    {block.type === "image" && (
                      <div className="my-6">
                        {imageSrc ? (
                          <img src={imageSrc} alt={block.alt || ""} className="w-full rounded-lg" />
                        ) : (
                          <div className="w-full h-40 rounded-lg bg-[#FDFBF7] border-2 border-dashed border-[#E29C15]/50 flex items-center justify-center text-[#0B1A35]/40 text-sm">
                            No image uploaded for this block
                          </div>
                        )}
                        {/* {block.caption && (
                          <p className="text-sm text-[#2A190C80] italic mt-2">{block.caption}</p>
                        )} */}
                      </div>
                    )}

                    {block.type === "quote" && (
                      <blockquote className="border-l-4 border-[#E29C15] pl-4 italic text-[#0B1A35]/80 my-4">
                        {block.text || "Empty quote"}
                      </blockquote>
                    )}

                    {block.type === "code" && (
                      <pre className="bg-[#0B1A35] text-[#FDFBF7] rounded-lg p-4 overflow-x-auto text-sm my-4">
                        <code>{block.text || "// empty code block"}</code>
                      </pre>
                    )}

                    {block.type === "proTip" && (
                      <div className="bg-[#FBEFD4] border-l-4 border-[#E29C15] p-4 rounded my-4">
                        <div className="font-semibold text-[#5B2D07] mb-2">💡 Pro Tip</div>
                        {block.text ? (
                          <div dangerouslySetInnerHTML={{ __html: block.text }} />
                        ) : (
                          <p className="text-[#0B1A35]/40 italic">Empty pro tip</p>
                        )}
                      </div>
                    )}

                    {block.type === "link" && (
                      <p className="my-4">
                        <a
                          href={block.href || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#E29C15] underline"
                        >
                          {block.text || block.href || "Untitled link"}
                        </a>
                      </p>
                    )}

                    {block.type === "button" && (
                      <p className="my-4">
                        <a
                          href={block.href || "#"}
                          target={block.buttonTarget || "_self"}
                          rel="noopener noreferrer"
                          className="inline-block px-5 py-2.5 bg-[#E29C15] hover:bg-[#C98B24] text-white text-sm font-semibold rounded-lg no-underline transition-colors"
                        >
                          {block.text || "Untitled button"}
                        </a>
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sortable Block Wrapper ──────────────────────────────────────────── */
function SortableBlock({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {children({ listeners })}
    </div>
  );
}

/* ─── Rich Text Input ─────────────────────────────────────────────────── */
function RichTextInput({ value, onChange, placeholder }) {
  const editorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState([]);

  const checkFormats = () => {
    if (!editorRef.current) return;
    const formats = [];
    if (document.queryCommandState("bold")) formats.push("bold");
    if (document.queryCommandState("italic")) formats.push("italic");
    if (document.queryCommandState("underline")) formats.push("underline");
    setActiveFormats(formats);
  };

  const exec = (command, value = null) => {
    editorRef.current.focus();
    document.execCommand(command, false, value);
    checkFormats();
  };

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    onChange(editorRef.current.innerHTML);
    checkFormats();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      document.execCommand("insertHTML", false, "<br><br>");
      e.preventDefault();
    }
  };

  const getBtnClass = (formatName) => {
    const isActive = activeFormats.includes(formatName);
    return `p-1.5 rounded transition-colors ${
      isActive ? "bg-[#E29C15] text-white" : "hover:bg-[#E29C15]/10 text-[#5B2D07]"
    }`;
  };

  return (
    <div className="border border-[#E29C15]/70 rounded-lg overflow-hidden bg-white">
      <div className="flex items-center gap-1 border-b border-[#E29C15]/30 p-2 bg-[#FDFBF7] flex-wrap">
        <button type="button" onClick={() => exec("bold")} className={getBtnClass("bold")} title="Bold">
          <Bold className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => exec("italic")} className={getBtnClass("italic")} title="Italic">
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec("underline")}
          className={getBtnClass("underline")}
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[#E29C15]/30 mx-1" />

        <button
          type="button"
          onClick={() => {
            const url = prompt("Enter link URL");
            if (url) exec("createLink", url);
          }}
          className="p-1.5 rounded hover:bg-[#E29C15]/10 text-[#5B2D07]"
          title="Insert Link"
        >
          <Link2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => exec("removeFormat")}
          className="ml-auto px-2.5 py-1 text-xs font-medium rounded hover:bg-[#E29C15]/10 text-[#5B2D07]"
        >
          Clear
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="p-3 min-h-[100px] outline-none prose prose-sm max-w-none text-[#0B1A35]"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onKeyUp={checkFormats}
        onMouseUp={checkFormats}
        data-placeholder={placeholder}
      />

      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #0B1A3560;
          pointer-events: none;
          display: block;
        }
      `}</style>
    </div>
  );
}

/* ─── Blog Details Section ────────────────────────────────────────────── */
function BlogDetails({ form, onChange }) {
  return (
    <div className="bg-[#FDFBF7] rounded-lg p-6 shadow-sm">
      <h2 className="font-serif text-xl text-[#5B2D07] mb-6">Blog Details</h2>

      {/* Title */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-[#5B2D07] mb-1.5">
          Blog Title<span className="text-[#E29C15] ml-0.5">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="Enter blog title"
          className="w-full rounded-lg border border-[#E29C15]/70 bg-transparent px-4 py-2.5 text-sm text-[#0B1A35] placeholder:text-[#0B1A35]/40 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
        />
      </div>

      {/* Slug (read-only, backend-generated) */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-[#5B2D07] mb-1.5">Slug</label>
        <div className="flex items-center rounded-lg border border-[#E29C15]/30 bg-black/5 px-4 py-2.5 cursor-not-allowed">
          <span className="text-sm text-[#0B1A35]/40 whitespace-nowrap">/blog/</span>
          <input
            type="text"
            value={form.slug}
            disabled
            title="Slug is generated automatically from the title"
            className="flex-1 bg-transparent text-sm text-[#0B1A35]/60 border-none outline-none min-w-0 cursor-not-allowed"
          />
        </div>
        <p className="text-xs text-[#2A190C80] mt-1">Auto-generated from title</p>
      </div>

      {/* Category + Author */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block text-sm font-medium text-[#5B2D07] mb-1.5">
            Category<span className="text-[#E29C15] ml-0.5">*</span>
          </label>
          <select
            value={form.category}
            onChange={(e) => onChange("category", e.target.value)}
            className="w-full rounded-lg border border-[#E29C15]/70 bg-transparent px-4 py-2.5 text-sm text-[#0B1A35] appearance-none focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#5B2D07] mb-1.5">
            Author<span className="text-[#E29C15] ml-0.5">*</span>
          </label>
          <input
            type="text"
            value={form.author}
            onChange={(e) => onChange("author", e.target.value)}
            placeholder="Author name"
            className="w-full rounded-lg border border-[#E29C15]/70 bg-transparent px-4 py-2.5 text-sm text-[#0B1A35] placeholder:text-[#0B1A35]/40 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-[#5B2D07] mb-1.5">Tags</label>
        <input
          type="text"
          value={form.tags}
          onChange={(e) => onChange("tags", e.target.value)}
          placeholder="e.g. Teak Wood, Heritage, Handmade (comma separated)"
          className="w-full rounded-lg border border-[#E29C15]/70 bg-transparent px-4 py-2.5 text-sm text-[#0B1A35] placeholder:text-[#0B1A35]/40 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
        />
      </div>
    </div>
  );
}

/* ─── Featured / Hero Image Section ───────────────────────────────────── */
function FeaturedImage({ image, onReplace }) {
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onReplace(file, url);
  };

  return (
    <div className="bg-[#FDFBF7] rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl text-[#5B2D07]">Hero Image</h2>
        <button
          onClick={() => fileRef.current?.click()}
          className="text-sm font-semibold text-[#E29C15] hover:text-[#C98B24] transition-colors"
        >
          Replace
        </button>
      </div>

      <div
        onClick={() => fileRef.current?.click()}
        className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#E29C15]/60 hover:border-[#E29C15] px-6 py-10 text-center cursor-pointer transition-colors overflow-hidden"
      >
        {image ? (
          <img src={image} alt="Hero" className="max-h-48 rounded-lg object-contain" />
        ) : (
          <>
            <ImageIcon className="w-8 h-8 text-[#0B1A35]/40" />
            <span className="text-sm text-[#0B1A35]/60">Click to upload hero image</span>
            <span className="text-xs text-[#0B1A35]/40">Recommended size: 1200 × 600 px</span>
          </>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

/* ─── Block Toolbar Button ────────────────────────────────────────────── */
function BlockBtn({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-lg border border-[#E29C15] text-[#E29C15] hover:bg-[#E29C15] hover:text-white transition-colors px-3.5 py-2 text-sm font-semibold whitespace-nowrap"
    >
      <Plus className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

/* ─── Content Block Editor ────────────────────────────────────────────── */
function ContentBlock({ block, index, onUpdate, onRemove, listeners }) {
  return (
    <div className="bg-[#FDFBF7] rounded-lg p-6 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E29C15]/30 pb-4">
        <div className="flex items-center gap-3">
          <span {...listeners} className="cursor-move select-none text-[#0B1A35]/40">
            <GripVertical className="w-5 h-5" />
          </span>
          <span className="font-serif text-lg text-[#5B2D07] capitalize">{block.type}</span>
        </div>
        <button
          onClick={() => onRemove(block.id)}
          className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Remove
        </button>
      </div>

      {/* Body */}
      <div className="space-y-4">
        {block.type === "heading" && (
          <>
            <div>
              <label className="block text-sm font-medium text-[#5B2D07] mb-1.5">Heading Level</label>
              <select
                value={block.level || "h2"}
                onChange={(e) => onUpdate(index, "level", e.target.value)}
                className="w-full rounded-lg border border-[#E29C15]/70 bg-transparent px-4 py-2.5 text-sm text-[#0B1A35] focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
              >
                <option value="h1">H1</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
                <option value="h4">H4</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5B2D07] mb-1.5">Heading Text</label>
              <input
                type="text"
                value={block.text || ""}
                onChange={(e) => onUpdate(index, "text", e.target.value)}
                placeholder="Enter heading text"
                className="w-full rounded-lg border border-[#E29C15]/70 bg-transparent px-4 py-2.5 text-sm text-[#0B1A35] placeholder:text-[#0B1A35]/40 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
              />
            </div>
          </>
        )}

        {block.type === "text" && (
          <RichTextInput
            value={block.text || ""}
            onChange={(val) => onUpdate(index, "text", val)}
            placeholder="Paragraph text..."
          />
        )}

        {block.type === "list" && (
          <>
            <div>
              <label className="block text-sm font-medium text-[#5B2D07] mb-1.5">List Style</label>
              <select
                value={block.style || "bullet"}
                onChange={(e) => onUpdate(index, "style", e.target.value)}
                className="w-full rounded-lg border border-[#E29C15]/70 bg-transparent px-4 py-2.5 text-sm text-[#0B1A35] focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
              >
                <option value="bullet">Bullet List</option>
                <option value="number">Numbered List</option>
              </select>
            </div>

            {(block.items || []).map((item, i) => (
              <RichTextInput
                key={i}
                value={item}
                onChange={(val) => {
                  const items = [...(block.items || [])];
                  items[i] = val;
                  onUpdate(index, "items", items);
                }}
                placeholder={`List item ${i + 1}`}
              />
            ))}

            <button
              type="button"
              onClick={() => onUpdate(index, "items", [...(block.items || []), ""])}
              className="text-sm font-semibold text-[#E29C15] hover:text-[#C98B24] transition-colors"
            >
              + Add List Item
            </button>
          </>
        )}

        {block.type === "image" && (
          <>
            <div>
              <label className="block text-sm font-medium text-[#5B2D07] mb-1.5">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onUpdate(index, "preview", URL.createObjectURL(file));
                    onUpdate(index, "file", file);
                  }
                }}
                className="w-full text-sm text-[#0B1A35]"
              />
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-[#5B2D07] mb-1.5">Alt Text</label>
              <input
                type="text"
                value={block.alt || ""}
                onChange={(e) => onUpdate(index, "alt", e.target.value)}
                placeholder="Describe the image"
                className="w-full rounded-lg border border-[#E29C15]/70 bg-transparent px-4 py-2.5 text-sm text-[#0B1A35] placeholder:text-[#0B1A35]/40 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5B2D07] mb-1.5">Caption</label>
              <input
                type="text"
                value={block.caption || ""}
                onChange={(e) => onUpdate(index, "caption", e.target.value)}
                placeholder="Optional caption"
                className="w-full rounded-lg border border-[#E29C15]/70 bg-transparent px-4 py-2.5 text-sm text-[#0B1A35] placeholder:text-[#0B1A35]/40 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
              />
            </div> */}

            {(block.preview || block._existingImageUrl || block.imageurl?.url) && (
              <img
                src={block.preview || block._existingImageUrl || block.imageurl?.url}
                alt=""
                className="rounded-lg w-full max-h-64 object-cover"
              />
            )}
          </>
        )}

        {block.type === "quote" && (
          <div>
            <label className="block text-sm font-medium text-[#5B2D07] mb-1.5">Quote</label>
            <textarea
              rows={3}
              value={block.text || ""}
              onChange={(e) => onUpdate(index, "text", e.target.value)}
              placeholder="Enter quote text"
              className="w-full rounded-lg border border-[#E29C15]/70 bg-transparent px-4 py-2.5 text-sm text-[#0B1A35] placeholder:text-[#0B1A35]/40 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50 resize-none"
            />
          </div>
        )}

        {block.type === "code" && (
          <div>
            <label className="block text-sm font-medium text-[#5B2D07] mb-1.5">Code</label>
            <textarea
              rows={5}
              value={block.text || ""}
              onChange={(e) => onUpdate(index, "text", e.target.value)}
              placeholder="Paste code snippet"
              className="w-full rounded-lg border border-[#E29C15]/70 bg-[#0B1A35] text-[#FDFBF7] font-mono px-4 py-2.5 text-sm placeholder:text-[#FDFBF7]/40 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50 resize-none"
            />
          </div>
        )}

        {block.type === "proTip" && (
          <>
            <RichTextInput
              value={block.text || ""}
              onChange={(val) => onUpdate(index, "text", val)}
              placeholder="Pro tip content..."
            />
            {block.text && (
              <div className="bg-[#FBEFD4] border-l-4 border-[#E29C15] p-4 rounded">
                <div className="font-semibold text-[#5B2D07] mb-2">💡 Pro Tip</div>
                <div dangerouslySetInnerHTML={{ __html: block.text }} />
              </div>
            )}
          </>
        )}

        {block.type === "link" && (
          <>
            <div>
              <label className="block text-sm font-medium text-[#5B2D07] mb-1.5">Link Text</label>
              <input
                type="text"
                value={block.text || ""}
                onChange={(e) => onUpdate(index, "text", e.target.value)}
                placeholder="Displayed link text"
                className="w-full rounded-lg border border-[#E29C15]/70 bg-transparent px-4 py-2.5 text-sm text-[#0B1A35] placeholder:text-[#0B1A35]/40 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5B2D07] mb-1.5">Link URL</label>
              <input
                type="text"
                value={block.href || ""}
                onChange={(e) => onUpdate(index, "href", e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-lg border border-[#E29C15]/70 bg-transparent px-4 py-2.5 text-sm text-[#0B1A35] placeholder:text-[#0B1A35]/40 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
              />
            </div>
          </>
        )}

        {block.type === "button" && (
          <>
            <div>
              <label className="block text-sm font-medium text-[#5B2D07] mb-1.5">Button Text</label>
              <input
                type="text"
                value={block.text || ""}
                onChange={(e) => onUpdate(index, "text", e.target.value)}
                placeholder="e.g. Contact Us"
                className="w-full rounded-lg border border-[#E29C15]/70 bg-transparent px-4 py-2.5 text-sm text-[#0B1A35] placeholder:text-[#0B1A35]/40 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5B2D07] mb-1.5">Button URL</label>
              <input
                type="text"
                value={block.href || ""}
                onChange={(e) => onUpdate(index, "href", e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-lg border border-[#E29C15]/70 bg-transparent px-4 py-2.5 text-sm text-[#0B1A35] placeholder:text-[#0B1A35]/40 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5B2D07] mb-1.5">Open Link In</label>
              <select
                value={block.buttonTarget || "_self"}
                onChange={(e) => onUpdate(index, "buttonTarget", e.target.value)}
                className="w-full rounded-lg border border-[#E29C15]/70 bg-transparent px-4 py-2.5 text-sm text-[#0B1A35] focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
              >
                <option value="_self">Same Tab</option>
                <option value="_blank">New Tab</option>
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Main Blog Form ──────────────────────────────────────────────────── */
export default function BlogForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const blogId = searchParams.get("id");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "",
    tags: "",
    author: "",
    status: "draft",
  });

  const [blogDocId, setBlogDocId] = useState(null);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fetchingBlog, setFetchingBlog] = useState(Boolean(blogId));
  
  // New states for success popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  // Load existing blog if editing
  useEffect(() => {
    if (!blogId) return;

    const fetchBlog = async () => {
      try {
        setFetchingBlog(true);
        const response = await api.get(summaryApi.getBlogsById.url.replace(":id", blogId));
        const blog = response.data?.data || response.data;
        if (!blog) throw new Error("Blog data not found");

        setBlogDocId(blog._id);
        setForm({
          title: blog.title || "",
          slug: blog.slug || "",
          category: blog.category || "",
          tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "",
          author: blog.author || "",
          status: blog.status || "draft",
        });

        if (blog.heroimage?.url) setFeaturedImagePreview(blog.heroimage.url);

        if (Array.isArray(blog.content)) {
          const processed = blog.content.map((block) => {
            if (block.type === "image" && block.imageurl?.url) {
              return {
                ...block,
                id: block.id || uuidv4(),
                preview: block.imageurl.url,
                _existingImageUrl: block.imageurl.url,
                file: null,
              };
            }
            return { ...block, id: block.id || uuidv4() };
          });
          setBlocks(processed);
        }
      } catch (err) {
        console.error("Error loading blog:", err);
        const errorMsg = err.response?.data?.message || "Failed to load blog";
        setMessage(errorMsg);
        toast.error(errorMsg);
      } finally {
        setFetchingBlog(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  const handleFormChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleFeaturedImageChange = (file, previewUrl) => {
    setFeaturedImage(file);
    setFeaturedImagePreview(previewUrl);
  };

  const addBlock = (type) => {
    const baseBlock = { id: uuidv4(), type };
    const blockDefaults = {
      heading: { level: "h2", text: "" },
      text: { text: "" },
      list: { style: "bullet", items: [""] },
      image: { file: null, preview: null, _existingImageUrl: null },
      quote: { text: "" },
      code: { text: "" },
      proTip: { text: "" },
      link: { text: "", href: "" },
      button: { text: "", href: "", buttonTarget: "_self" },
    };
    setBlocks([...blocks, { ...baseBlock, ...blockDefaults[type] }]);
  };

  const updateBlock = (index, key, value) => {
    const copy = [...blocks];
    copy[index][key] = value;
    setBlocks(copy);
  };

  const removeBlock = (id) => setBlocks(blocks.filter((b) => b.id !== id));

  const handleBlockDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) setBlocks(arrayMove(blocks, oldIndex, newIndex));
  };

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    navigate("/admin-panel/blogs");
  };

  const handleSubmit = async (publishStatus) => {
    if (!form.title.trim()) {
      setMessage("Title is required");
      toast.error("Title is required");
      return;
    }
    if (!form.category) {
      setMessage("Category is required");
      toast.error("Category is required");
      return;
    }
    if (!form.author.trim()) {
      setMessage("Author is required");
      toast.error("Author is required");
      return;
    }
    if (blogId && !blogDocId) {
      setMessage("Blog ID not resolved yet. Please wait and try again.");
      toast.error("Blog ID not resolved yet. Please wait and try again.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Keep imageurl for existing images; new image blocks get filled in
      // by the backend from the uploaded files using imagePositions below.
      const contentBlocks = blocks.map((b) => {
        const blockCopy = { ...b };
        if (
          b.type === "image" &&
          !b.file &&
          (b._existingImageUrl || b.preview) &&
          (b._existingImageUrl || b.preview).includes("http")
        ) {
          blockCopy.imageurl = { url: b._existingImageUrl || b.preview };
        }
        delete blockCopy.file;
        delete blockCopy.preview;
        delete blockCopy._existingImageUrl;
        return blockCopy;
      });

      const tagsArray = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("author", form.author);
      formData.append("status", publishStatus);
      formData.append("tags", JSON.stringify(tagsArray));
      formData.append("content", JSON.stringify(contentBlocks));

      if (featuredImage instanceof File) {
        formData.append("heroImage", featuredImage);
      }

      // Attach new image files + their index in contentBlocks, so the
      // backend can slot the uploaded file into the right block.
      const newImagePositions = [];
      blocks.forEach((block, idx) => {
        if (block.type === "image" && block.file instanceof File) {
          formData.append("image", block.file);
          newImagePositions.push(idx);
        }
      });
      if (newImagePositions.length > 0) {
        formData.append("imagePositions", JSON.stringify(newImagePositions));
      }

      if (blogId) {
        await api.put(summaryApi.updateBlogsById.url.replace(":id", blogDocId), formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setIsUpdateMode(true);
        setShowSuccessPopup(true);
        toast.success("Blog updated successfully!");
      } else {
        await api.post(summaryApi.createBlog.url, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setIsUpdateMode(false);
        setShowSuccessPopup(true);
        toast.success("Blog published successfully!");
      }
    } catch (err) {
      console.error("Error saving blog:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to save blog";
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#5B2D07]">
            {blogId ? "Edit Blog" : "Create Blog"}
          </h1>
          <p className="mt-1 text-sm text-[#2A190C80]">
            Blogs &gt; {blogId ? "Edit Blog" : "Add New Blog"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg border border-[#E29C15] text-[#E29C15] hover:bg-[#E29C15] hover:text-white transition-colors px-4 py-2 text-sm font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E29C15] text-[#E29C15] hover:bg-[#E29C15] hover:text-white transition-colors px-4 py-2 text-sm font-semibold"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>

          {blogId && (
            <button
              onClick={() => handleSubmit("draft")}
              disabled={loading}
              className="rounded-lg border border-[#5B2D07]/40 text-[#5B2D07] hover:bg-[#5B2D07]/5 disabled:opacity-60 transition-colors px-4 py-2 text-sm font-semibold"
            >
              {loading ? "Saving..." : "Save as Draft"}
            </button>
          )}

          <button
            onClick={() => handleSubmit("published")}
            disabled={loading}
            className="rounded-lg bg-[#E29C15] hover:bg-[#C98B24] disabled:opacity-60 transition-colors px-4 py-2 text-sm font-semibold text-white"
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      {message && (
        <div className="mt-4 p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm">
          {message}
        </div>
      )}

      {/* Success Popup */}
      <SuccessPopup 
        isOpen={showSuccessPopup} 
        onClose={handleSuccessPopupClose}
        isUpdate={isUpdateMode}
      />

      <BlogPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        form={form}
        blocks={blocks}
        featuredImagePreview={featuredImagePreview}
      />

      {fetchingBlog ? (
        <div className="mt-10 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-[#E29C15] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[#2A190C80] font-medium">Loading blog data...</p>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-6">
          <BlogDetails form={form} onChange={handleFormChange} />
          <FeaturedImage image={featuredImagePreview} onReplace={handleFeaturedImageChange} />

          <div className="bg-[#FDFBF7] rounded-lg p-6 shadow-sm">
            <h2 className="font-serif text-xl text-[#5B2D07] mb-4">Content Blocks</h2>
            <div className="flex flex-wrap gap-2">
              {BLOCK_TYPES.map((b) => (
                <BlockBtn key={b.type} label={b.label} onClick={() => addBlock(b.type)} />
              ))}
            </div>
          </div>

          <DndContext collisionDetection={closestCenter} onDragEnd={handleBlockDragEnd}>
            <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {blocks.length === 0 ? (
                  <div className="bg-[#FDFBF7] rounded-lg border-2 border-dashed border-[#E29C15]/40 p-8 text-center">
                    <p className="text-[#2A190C80] text-sm">
                      No content blocks yet. Add one above to get started!
                    </p>
                  </div>
                ) : (
                  blocks.map((block, index) => (
                    <SortableBlock key={block.id} id={block.id}>
                      {({ listeners }) => (
                        <ContentBlock
                          block={block}
                          index={index}
                          onUpdate={updateBlock}
                          onRemove={removeBlock}
                          listeners={listeners}
                        />
                      )}
                    </SortableBlock>
                  ))
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}