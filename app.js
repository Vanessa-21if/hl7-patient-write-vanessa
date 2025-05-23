const API_BASE_URL = "https://hl7-fhir-ehr-vane.onrender.com";
const response = await fetch(`${API_BASE_URL}/patient`, {  
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(patientData)
});
let currentpatientId = null; // Almacena el ID del paciente registrado
// ========== REGISTRO BÁSICO DE PACIENTE ========== //
document.getElementById("patientForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // 1. Obtener solo datos esenciales del paciente
const patientData = {
  name: {
    given: document.getElementById("name").value,
    family: document.getElementById("familyName").value
  },
  identifier: {
    system: document.getElementById("identifierSystem").value,
    value: document.getElementById("identifierValue").value
  }
};
  try {
    // 2. Enviar a la API (POST /patient)
    const response = await fetch(`${API_BASE_URL}/patient`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patientData),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Error al registrar paciente");

    // 3. Guardar ID del paciente y mostrar sección de medicamentos
    currentpatientId = data._id;
    document.getElementById("patientId").value = currentpatientId;
    document.getElementById("medicationSection").style.display = "block";

    alert(`✅ Paciente registrado (ID: ${currentpatientId})`);
  } catch (error) {
    console.error("Error:", error);
    alert(`❌ Error: ${error.message}`);
  }
});

// ========== REGISTRO DE MEDICAMENTO ========== //
document.getElementById("medicationForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentpatientId) {
    alert("⚠️ Primero registra un paciente");
    return;
  }

  // 1. Validar campos numéricos
  const quantity = parseInt(document.getElementById("quantity").value);
  const daysSupply = parseInt(document.getElementById("daysSupply").value);

  if (isNaN(quantity) || isNaN(daysSupply)) {
    alert("La cantidad y días de suministro deben ser números");
    return;
  }

  // 2. Crear objeto FHIR MedicationDispense con datos esenciales
  const medicationData = {
    resourceType: "MedicationDispense",
    status: "completed",
    medicationCodeableConcept: {
      text: document.getElementById("medicationName").value,
    },
    subject: {
      reference: `patient/${currentpatientId}`,
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
    // 3. Enviar a la API (POST /patient/{id}/medications)
    const response = await fetch(`${API_BASE_URL}/patient/${currentpatientId}/medications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(medicationData),
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.message || "Error al guardar medicamento");

    alert("✅ Medicamento registrado correctamente");
    document.getElementById("medicationForm").reset();
  } catch (error) {
    console.error("Error:", error);
    alert(`❌ Error: ${error.message}`);
  }
});
