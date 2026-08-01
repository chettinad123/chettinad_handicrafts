import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, PlusCircle, Eye, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../common/apiClient";
import SummaryApi from "../common/SummaryApi";

const statuses = ["new", "read", "responded"];
const STATUS_TO_LABEL = {
  new: "New",
  read: "Read",
  responded: "Responded",
};

function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-4 py-2">
      <span className="font-serif text-lg text-[#5B2D07]">{label}</span>
      <span className="text-sm text-[#2A190C]">{value || "—"}</span>
    </div>
  );
}

function getStatusIcon(status) {
  switch (status) {
    case "new":
      return <PlusCircle className="w-4 h-4" />;
    case "read":
      return <Eye className="w-4 h-4" />;
    case "responded":
      return <CheckCircle className="w-4 h-4" />;
    default:
      return null;
  }
}

function getStatusColor(status) {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-700 border-blue-300";
    case "read":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "responded":
      return "bg-green-100 text-green-700 border-green-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
}

export default function ContactDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchContact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchContact = async () => {
    setLoading(true);
    try {
      const res = await api({
        url: SummaryApi.getContactById.url.replace(":id", id),
        method: SummaryApi.getContactById.method,
      });

      const c = res.data?.data;

      setContact({
        name: c.name,
        phoneNumber: c.phoneNumber,
        emailAddress: c.emailAddress,
        subject: c.subject,
        message: c.message,
        status: c.status || "new",
        createdAt: c.createdAt
          ? new Date(c.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "",
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load message.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    const prevStatus = contact.status;

    setContact((prev) => ({ ...prev, status: newStatus }));

    try {
      await api({
        url: SummaryApi.editContactStatus.url.replace(":id", id),
        method: SummaryApi.editContactStatus.method,
        data: { status: newStatus },
      });
      toast.success(`Status updated to "${STATUS_TO_LABEL[newStatus]}"!`);
    } catch (err) {
      setContact((prev) => ({ ...prev, status: prevStatus }));
      toast.error(err?.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-[#2A190C80]">
        Loading message...
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="py-16 text-center text-sm text-[#2A190C80]">
        Message not found.
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#5B2D07]">
            Contact Message Details
          </h1>
          <p className="mt-1 text-sm text-[#2A190C80]">
            Contact Us &gt; Message Details
          </p>
        </div>

        <button
          onClick={() => navigate("/admin-panel/contacts")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#E29C15] text-[#E29C15] hover:bg-[#E29C15] hover:text-white transition-colors px-4 py-2 text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Messages
        </button>
      </div>

      {/* Content card */}
      <div className="mt-6 rounded bg-[#FDFBF7] p-6 sm:p-8 shadow-sm space-y-10">
        {/* Status Section */}
        <div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="font-serif text-xl text-[#5B2D07]">Message Status</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#2A190C80]">Current Status:</span>
              <div className="flex items-center gap-2">
                {statuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    disabled={updatingStatus || contact.status === s}
                    className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-all
                      ${
                        contact.status === s
                          ? getStatusColor(s) + " cursor-default"
                          : "bg-white text-[#2A190C] border-[#E29C15]/50 hover:bg-[#E29C15]/10 hover:border-[#E29C15]"
                      }
                      ${updatingStatus ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    {getStatusIcon(s)}
                    {STATUS_TO_LABEL[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="font-serif text-xl text-[#5B2D07] mb-4">Contact Information</h2>
            <InfoRow label="Name" value={contact.name} />
            <InfoRow label="Phone Number" value={contact.phoneNumber} />
            <InfoRow label="Email Address" value={contact.emailAddress} />
          </div>
          <div>
            <h2 className="font-serif text-xl text-[#5B2D07] mb-4">Message Information</h2>
            <InfoRow label="Date" value={contact.createdAt} />
            <div className="flex items-center gap-2 py-2">
              <Mail className="w-4 h-4 text-[#5B2D07]" />
              <Phone className="w-4 h-4 text-[#5B2D07]" />
            </div>
          </div>
        </div>

        {/* Subject & message */}
        <div>
          <h2 className="font-serif text-xl text-[#5B2D07] mb-2">Subject</h2>
          <p className="text-sm text-[#2A190C]">{contact.subject}</p>
        </div>

        <div>
          <h2 className="font-serif text-xl text-[#5B2D07] mb-2">Message</h2>
          <p className="text-sm leading-relaxed text-[#5B2D07] whitespace-pre-wrap">
            {contact.message}
          </p>
        </div>
      </div>
    </div>
  );
}