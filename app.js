const API_BASE_URL = "https://hl7-fhir-ehr-vane.onrender.com";

document.getElementById("patientForm").addEventListener("submit", async (e) => {e.preventDefault();

  const identifierValue = document.getElementById("identifierValue").value;
  const nameMedicine = document.getElementById("nameMedicine").value;
  const presentation = document.getElementById("presentation").value;
  const dose = document.getElementById("dose").value;
  const amount = parseInt(document.getElementById("amount").value);
  const disgnosis = document.getElementById("disgnosis").value;
  const recipeDate = document.getElementById("recipeDate").value;
  const institution = document.getElementById("institution").value;
  const observations = document.getElementById("observations").value;

  if (isNaN(amount)) {
    alert("⚠️ La cantidad debe ser un número válido.");
    return;
  }

  // 1. Crear objeto completo con datos FHIR
  const dataToSend = {
    patient: {
      resourceType: "Patient",
      identifier: [
        {
          value: identifierValue,
        },
      ],
    },
    medicationDispense: {
      resourceType: "MedicationDispense",
      status: "completed",
      medicationCodeableConcept: {
        text: nameMedicine,
      },
      quantity: {
        value: amount,
        unit: "unidades",
      },
      dosageInstruction: [
        {
          text: dose,
        },
      ],
      daysSupply: {
        value: 1,
        unit: "día(s)",
      },
      extension: [
        {
          url: "http://example.org/fhir/StructureDefinition/presentation",
          valueString: presentation,
        },
        {
          url: "http://example.org/fhir/StructureDefinition/disgnosis",
          valueString: disgnosis,
        },
        {
          url: "http://example.org/fhir/StructureDefinition/recipeDate",
          valueString: recipeDate,
        },
        {
          url: "http://example.org/fhir/StructureDefinition/institution",
          valueString: institution,
        },
        {
          url: "http://example.org/fhir/StructureDefinition/observations",
          valueString: observations,
        },
      ],
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}/medications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.message || "Error al registrar la dispensación");
    alert("✅ Dispensación registrada correctamente.");
  } catch (error) {
    alert(" Error.");
