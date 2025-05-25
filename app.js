const API_BASE_URL = "https://hl7-fhir-ehr-vane.onrender.com";

document.getElementById("patientForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const identifierValue = document.getElementById("identifierValue").value;
  const nameMedicine = document.getElementById("nameMedicine").value;
  const presentation = document.getElementById("presentation").value;
  const dose = document.getElementById("dose").value;
  const amount = parseInt(document.getElementById("amount").value);
  const diagnosis = document.getElementById("disgnosis").value;
  const recipeDate = document.getElementById("recipeDate").value;
  const institution = document.getElementById("institution").value;
  const observations = document.getElementById("observations").value;

  if (isNaN(amount)) {
    alert("⚠️ La cantidad debe ser un número válido.");
    return;
  }

  // ESTRUCTURA JSON
  const dataToSend = {
  patient: {
    document: identifierValue,
  },
  medication: {
    nameMedicine: nameMedicine,
    presentation: presentation,
    dose: dose,
    amount: amount,
    diagnosis: disgnosis,  // ✅ corregido nombre del campo
    recipeDate: recipeDate,
    institution: institution,
    observations: observations
  }
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
    alert("❌ Error: " + error.message);
  }
});
