import jsPDF from "jspdf";

export const generateTicket = (reservation = {}) => {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 150], // Receipt size
    });

    const primaryColor = "#f27f0d";
    const textColor = "#2c241b";
    const lightTextColor = "#6b7280";

    // Data cleanup - Ensure everything is a string
    const id = String(reservation.id || "N/A")
      .slice(0, 8)
      .toUpperCase();
    const clientName = String(reservation.clientName || "Client").substring(
      0,
      25,
    );
    const clientPhone = String(reservation.clientPhone || "Non renseigné");
    const fieldName = String(reservation.fieldName || "Terrain").substring(
      0,
      25,
    );
    const date = String(reservation.date || "---");
    const time = String(reservation.time || "--:--");
    const status = String(reservation.status || "En attente").toUpperCase();
    const paymentMethod = String(reservation.paymentMethod || "Non spécifié");

    // Header
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 80, 20, "F");

    doc.setTextColor("#ffffff");
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Footbooking", 40, 10, { align: "center" });
    doc.setFontSize(10);
    doc.text("TICKET DE RÉSERVATION", 40, 15, { align: "center" });

    // Body
    doc.setTextColor(textColor);

    // Reservation ID
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(lightTextColor);
    doc.text("Référence:", 10, 30);
    doc.setTextColor(textColor);
    doc.setFont("helvetica", "bold");
    doc.text(`#${id}`, 30, 30);

    // Client Info
    doc.setFontSize(9);
    doc.setTextColor(lightTextColor);
    doc.setFont("helvetica", "normal");
    doc.text("Client:", 10, 40);
    doc.setTextColor(textColor);
    doc.setFont("helvetica", "bold");
    doc.text(clientName, 10, 45);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(clientPhone, 10, 49);

    // Separator line
    doc.setDrawColor("#e5e7eb");
    doc.line(10, 55, 70, 55);

    // Field Details
    doc.setFontSize(9);
    doc.setTextColor(lightTextColor);
    doc.text("Terrain:", 10, 65);
    doc.setTextColor(textColor);
    doc.setFont("helvetica", "bold");
    doc.text(fieldName, 10, 70);

    // Date & Time
    doc.setFontSize(9);
    doc.setTextColor(lightTextColor);
    doc.setFont("helvetica", "normal");
    doc.text("Date:", 10, 80);
    doc.text("Heure:", 45, 80);

    doc.setTextColor(textColor);
    doc.setFont("helvetica", "bold");
    doc.text(date, 10, 85);
    doc.text(time, 45, 85);

    // Separator
    doc.line(10, 95, 70, 95);

    // Payment Info
    doc.setFontSize(9);
    doc.setTextColor(lightTextColor);
    doc.setFont("helvetica", "normal");
    doc.text("Statut:", 10, 105);
    doc.text("Paiement:", 45, 105);

    doc.setFont("helvetica", "bold");
    if (status.includes("PAYÉ") || status.includes("CONFIRMÉ")) {
      doc.setTextColor("#10b981"); // Green
    } else {
      doc.setTextColor(primaryColor);
    }
    doc.text(status, 10, 110);

    doc.setTextColor(textColor);
    doc.text(paymentMethod, 45, 110);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(lightTextColor);
    doc.setFont("helvetica", "italic");
    doc.text("Merci d'avoir utilisé Footbooking !", 40, 130, {
      align: "center",
    });
    doc.text("Présentez ce ticket à l'entrée du terrain.", 40, 135, {
      align: "center",
    });

    // Date of issue
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(`Généré le ${new Date().toLocaleString()}`, 40, 145, {
      align: "center",
    });

    // Save the PDF
    doc.save(`Ticket_${fieldName.replace(/\s+/g, "_")}_${date}.pdf`);
  } catch (error) {
    console.error("Critical error in ticket generation:", error);
  }
};
