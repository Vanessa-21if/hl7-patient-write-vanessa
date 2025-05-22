
const API_BASE_URL = "https://hl7-fhir-ehr-vane.onrender.com"; // URL de Render
let currentPatientId = null; // Almacena el ID del paciente registrado

// ========== REGISTRO DE PACIENTE ========== //
document.getElementById("patientForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // 1. Obtener datos del formulario
  const patientData = {
    resourceType: "Patient",
    name: [
      {
        given: [document.getElementById("name").value],
        family: document.getElementById("familyName").value,
      },
    ],
    gender: document.getElementById("gender").value,
    birthDate: document.getElementById("birthDate").value,
    identifier: [
      {
        system: document.getElementById("identifierSystem").value,
        value: document.getElementById("identifierValue").value,
      },
    ],
    telecom: [
      {
        system: "phone",
        value: document.getElementById("cellPhone").value,
      },
      {
        system: "email",
        value: document.getElementById("email").value,
      },
    ],
    address: [
      {
        city: document.getElementById("city").value,
        postalCode: document.getElementById("postalCode").value,
        line: [document.getElementById("address").value],
      },
    ],
  };

  try {
    // 2. Enviar a la API (POST /patient)
    const response = await fetch(`${API_BASE_URL}/patients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patientData),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Error al registrar paciente");

    // 3. Guardar ID del paciente y mostrar sección de medicamentos
    currentPatientId = data._id;
    document.getElementById("patientId").value = currentPatientId;
    document.getElementById("medicationSection").style.display = "block";

    alert(`✅ Paciente registrado (ID: ${currentPatientId})`);
  } catch (error) {
    console.error("Error:", error);
    alert(`❌ Error: ${error.message}`);
  }
});

// ========== REGISTRO DE MEDICAMENTO ========== //
document.getElementById("medicationForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentPatientId) {
    alert("⚠️ Primero registra un paciente");
    return;
  }

  // 1. Validar campos numéricos
  const quantity = parseInt(document.getElementById("quantity").value);
  const daysSupply = parseInt(document.getElementById("daysSupply").value);

  if (isNaN(quantity) {
    alert("La cantidad debe ser un número");
    return;
  }

  // 2. Crear objeto FHIR MedicationDispense
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
    performer: [
      {
        actor: {
          display: document.getElementById("prescribedBy").value,
        },
      },
    ],
  };

  // 3. Añadir notas si existen
  const notes = document.getElementById("notes").value;
  if (notes) medicationData.note = [{ text: notes }];

  try {
    // 4. Enviar a la API (POST /patient/{id}/medications)
    const response = await fetch(`${API_BASE_URL}/patient/${currentPatientId}/medications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(medicationData),
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.message || "Error al guardar medicamento");

    alert("✅ Medicamento registrado en MongoDB!");
    document.getElementById("medicationForm").reset();
  } catch (error) {
    console.error("Error:", error);
    alert(`❌ Error: ${error.message}`);
  }
});
