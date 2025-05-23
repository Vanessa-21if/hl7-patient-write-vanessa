const API_BASE_URL = "https://hl7-fhir-ehr-vane.onrender.com";
let currentPatientId = null; // Almacena el ID del paciente registrado

document.getElementById("patientForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentPatientId) {
    // REGISTRO DEL PACIENTE
    const patientData = {
      resourceType: "Patient",
      identifier: [
        {
          system: document.getElementById("identifierSystem").value,
          value: document.getElementById("identifierValue").value,
        },
      ],
    };

    try {
      const response = await fetch(`${API_BASE_URL}/patient`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al registrar paciente");

      currentPatientId = data._id;
      document.getElementById("patientId").value = currentPatientId;
      document.getElementById("medicationSection").style.display = "block";

      alert(`✅ Paciente registrado (ID: ${currentPatientId})`);
    } catch (error) {
      console.error("Error:", error);
      alert(`❌ Error al registrar paciente: ${error.message}`);
      return;
    }
  } else {
    // REGISTRO DEL MEDICAMENTO
    const quantity = parseInt(document.getElementById("quantity").value);
    const daysSupply = parseInt(document.getElementById("daysSupply").value);

    if (isNaN(quantity) || isNaN(daysSupply)) {
      alert("⚠️ La cantidad y días de suministro deben ser números");
      return;
    }

    const medicationData = {
      resourceType: "MedicationDispense",
      status: "completed",
      medicationCodeableConcept: {
        text: document.getElementById("medicationName").value,
      },
      subject: {
        reference: `Patient/${currentPatientId}`,
      },
      quantity: {
        value: quantity,
        unit: "unidades",
      },
      daysSupply: {
        value: daysSupply,
        unit: "días",
      },
      dosageInstruction: [
        {
          text: document.getElementById("dosage").value,
        },
      ],
    };

    try {
      const response = await fetch(`${API_BASE_URL}/patient/${currentPatientId}/medications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(medicationData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Error al registrar medicamento");

      alert("✅ Medicamento registrado correctamente");
      // Limpia campos de medicamento pero conserva los del paciente
      document.getElementById("medicationName").value = "";
      document.getElementById("dosage").value = "";
      document.getElementById("quantity").value = "";
      document.getElementById("daysSupply").value = "";
    } catch (error) {
      console.error("Error:", error);
      alert(`❌ Error al guardar medicamento: ${error.message}`);
    }
  }
});
