import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, Clock, PlusCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../common/apiClient"; // TODO: adjust path to your api.js
import SummaryApi from "../common/SummaryApi"; // TODO: adjust path to your summaryapi.js

const statuses = ["New", "In Progress", "Completed"];

// UI label <-> DB enum value ('new' | 'in-progress' | 'completed')
const LABEL_TO_STATUS = {
  New: "new",
  "In Progress": "in-progress",
  Completed: "completed",
};
const STATUS_TO_LABEL = {
  new: "New",
  "in-progress": "In Progress",
  completed: "Completed",
};

function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-4 py-2">
      <span className="font-serif text-base sm:text-lg text-[#5B2D07]">{label}</span>
      <span className="text-sm text-[#2A190C] break-words">{value}</span>
    </div>
  );
}

export default function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Admin notes state
  const [adminNotes, setAdminNotes] = useState(""); // text in the input box
  const [savedNote, setSavedNote] = useState(""); // what's actually saved in DB
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchOrder();
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await api({
        url: SummaryApi.getOrdersById.url.replace(":id", id),
        method: SummaryApi.getOrdersById.method,
      });

      const o = res.data?.data;

      setOrder({
        customerName: o.customer?.name || "—",
        phone: o.customer?.phoneNumber || "—",
        email: o.customer?.email || "—",
        cityState: [o.city, o.state].filter(Boolean).join(", "),
        projectCategory: o.projectCategory,
        projectType: o.projectType,
        referenceImage: o.referenceImageUrl || "",
        description: o.projectDescription,
        status: STATUS_TO_LABEL[o.status] || o.status,
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load order.");
    } finally {
      setLoading(false);
    }
  };

  // GET /notes/:id -> { success, data: { customerId, adminNotes } }
  const fetchNotes = async () => {
    try {
      const res = await api({
        url: SummaryApi.getNotesById.url.replace(":id", id),
        method: SummaryApi.getNotesById.method,
      });
      const note = res.data?.data?.adminNotes || "";
      setAdminNotes(note);
      setSavedNote(note);
    } catch (err) {
      console.error("Failed to load notes", err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "New":
        return <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
      case "In Progress":
        return <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
      case "Completed":
        return <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Completed":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    const prevStatus = order.status;

    // Optimistic update
    setOrder((prev) => ({ ...prev, status: newStatus }));

    try {
      await api({
        url: SummaryApi.editOrdersStatus.url.replace(":id", id),
        method: SummaryApi.editOrdersStatus.method,
        data: { status: LABEL_TO_STATUS[newStatus] },
      });
      toast.success(`Status updated to "${newStatus}"!`);
    } catch (err) {
      setOrder((prev) => ({ ...prev, status: prevStatus })); // revert
      toast.error(
        err?.response?.data?.message || "Failed to update status. Please try again."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // PUT /notes/:id -> { success, data: <customer with adminNotes> }
  const handleSaveNotes = async () => {
    if (!adminNotes.trim()) {
      toast.error("Please enter a note.");
      return;
    }
    setSaving(true);
    try {
      const res = await api({
        url: SummaryApi.updateNotesById.url.replace(":id", id),
        method: SummaryApi.updateNotesById.method,
        data: { adminNotes },
      });
      const saved = res.data?.data?.adminNotes ?? adminNotes;
      setSavedNote(saved);
      setAdminNotes(saved);
      setIsEditing(false);
      toast.success("Note saved!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save note. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // DELETE /notes/:id -> clears the note
  const handleDeleteNote = async () => {
    if (!window.confirm("Delete this note?")) return;
    setDeleting(true);
    try {
      await api({
        url: SummaryApi.deleteNotesById.url.replace(":id", id),
        method: SummaryApi.deleteNotesById.method,
      });
      setSavedNote("");
      setAdminNotes("");
      setIsEditing(false);
      toast.success("Note deleted!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete note. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-[#2A190C80]">
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-16 text-center text-sm text-[#2A190C80]">
        Order not found.
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-4 md:px-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl md:text-3xl text-[#5B2D07]">
            Custom Order Details
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#2A190C80]">
            Custom Orders &gt; Custom Order Details
          </p>
        </div>

        <button
          onClick={() => navigate("/admin-panel/orders")}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#E29C15] text-[#E29C15] hover:bg-[#E29C15] hover:text-white transition-colors px-4 py-2 text-xs sm:text-sm font-semibold w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Custom Orders
        </button>
      </div>

      {/* Content card */}
      <div className="mt-4 sm:mt-6 rounded bg-[#FDFBF7] p-4 sm:p-6 md:p-8 shadow-sm space-y-8 sm:space-y-10">
        {/* Status Section */}
        <div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:flex-wrap">
            <h2 className="font-serif text-lg sm:text-xl text-[#5B2D07]">Order Status</h2>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <span className="text-xs sm:text-sm text-[#2A190C80]">Current Status:</span>
              <div className="flex flex-wrap items-center gap-2">
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={updatingStatus || order.status === status}
                    className={`
                      flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border text-xs sm:text-sm font-medium transition-all whitespace-nowrap
                      ${
                        order.status === status
                          ? getStatusColor(status) + " cursor-default"
                          : "bg-white text-[#2A190C] border-[#E29C15]/50 hover:bg-[#E29C15]/10 hover:border-[#E29C15]"
                      }
                      ${updatingStatus ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    {getStatusIcon(status)}
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Customer + Project info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div>
            <h2 className="font-serif text-lg sm:text-xl text-[#5B2D07] mb-3 sm:mb-4">
              Customer Information
            </h2>
            <InfoRow label="Customer Name" value={order.customerName} />
            <InfoRow label="Phone Number" value={order.phone} />
            <InfoRow label="Email Address" value={order.email} />
            <InfoRow label="City / State" value={order.cityState} />
          </div>
          <div>
            <h2 className="font-serif text-lg sm:text-xl text-[#5B2D07] mb-3 sm:mb-4">
              Project Information
            </h2>
            <InfoRow label="Project Category" value={order.projectCategory} />
            <InfoRow label="Product Name" value={order.projectType} />
          </div>
        </div>

        {/* Reference image */}
        {order.referenceImage && (
          <div>
            <h2 className="font-serif text-lg sm:text-xl text-[#5B2D07] mb-3 sm:mb-4">
              Reference Image
            </h2>
            <img
              src={order.referenceImage}
              alt="Reference"
              className="w-full max-w-md rounded-lg object-cover"
            />
          </div>
        )}

        {/* Project requirements */}
        <div>
          <h2 className="font-serif text-lg sm:text-xl text-[#5B2D07] mb-2">
            Project Requirements
          </h2>
          <h3 className="font-serif text-base sm:text-lg text-[#5B2D07] mb-2">
            Project Description
          </h3>
          <p className="text-sm leading-relaxed text-[#5B2D07] break-words">
            {order.description}
          </p>
        </div>

        {/* Admin notes */}
        <div>
          <h2 className="font-serif text-lg sm:text-xl text-[#5B2D07] mb-2">Admin Notes</h2>

          {savedNote && !isEditing ? (
            // Saved note view — with Edit / Delete
            <div className="rounded-lg border border-[#E29C15]/40 bg-white px-4 py-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <p className="text-sm text-[#2A190C] whitespace-pre-wrap break-words">
                {savedNote}
              </p>
              <div className="flex gap-3 flex-shrink-0">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-semibold text-[#E29C15] hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteNote}
                  disabled={deleting}
                  className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ) : (
            // Add / Edit input
            <>
              <input
                type="text"
                placeholder="Add private notes about this customer (Only admin can see this)..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full rounded-lg border border-[#E29C15]/70 bg-transparent px-4 py-2.5 text-sm text-[#0B1A35] placeholder:text-[#0B1A35]/40 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
              />
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <button
                  onClick={handleSaveNotes}
                  disabled={saving}
                  className="rounded-lg bg-[#E29C15] hover:bg-[#C98B24] disabled:opacity-60 transition-colors px-6 py-2.5 text-sm font-semibold text-white w-full sm:w-auto"
                >
                  {saving ? "Saving..." : "Save Notes"}
                </button>
                {isEditing && (
                  <button
                    onClick={() => {
                      setAdminNotes(savedNote);
                      setIsEditing(false);
                    }}
                    className="rounded-lg border border-[#E29C15]/50 text-[#5B2D07] hover:bg-[#E29C15]/10 transition-colors px-6 py-2.5 text-sm font-semibold w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}