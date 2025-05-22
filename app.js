document.getElementById('patientForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener los valores del formulario del paciente
    const name = document.getElementById('name').value;
    const familyName = document.getElementById('familyName').value;
    const gender = document.getElementById('gender').value;
    const birthDate = document.getElementById('birthDate').value;
    const identifierSystem = document.getElementById('identifierSystem').value;
    const identifierValue = document.getElementById('identifierValue').value;
    const cellPhone = document.getElementById('cellPhone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const postalCode = document.getElementById('postalCode').value;

    // Crear el objeto Patient en formato FHIR
    const patient = {
        resourceType: "Patient",
        name: [{
            use: "official",
            given: [name],
            family: familyName
        }],
        gender: gender,
        birthDate: birthDate,
        identifier: [{
            system: identifierSystem,
            value: identifierValue
        }],
        telecom: [{
            system: "phone",
            value: cellPhone,
            use: "home"
        }, {
            system: "email",
            value: email,
            use: "home"
        }],
        address: [{
            use: "home",
            line: [address],
            city: city,
            postalCode: postalCode,
            country: "Colombia"
        }]
    };

    // Enviar los datos del paciente
    fetch('https://hl7-fhir-ehr-vane.onrender.com/patient', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(patient)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('Paciente creado exitosamente!');
        
        // Mostrar formulario de medicamento si se creó el paciente
        if(data._id) {
            document.getElementById('medicationSection').style.display = 'block';
            document.getElementById('patientId').value = data._id;
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Hubo un error al crear el paciente.');
    });
});

// Formulario para registrar medicamentos
document.getElementById('medicationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const patientId = document.getElementById('patientId').value;
    const medicationName = document.getElementById('medicationName').value;
    const quantity = document.getElementById('quantity').value;
    const daysSupply = document.getElementById('daysSupply').value;
    const dosage = document.getElementById('dosage').value;
    const prescribedBy = document.getElementById('prescribedBy').value;
    const notes = document.getElementById('notes').value;

    // Crear objeto MedicationDispense en formato FHIR
    const medicationData = {
        medication: medicationName,
        quantity: quantity,
        daysSupply: daysSupply,
        dosage: dosage,
        performer: prescribedBy,
        notes: notes,
        timestamp: new Date().toISOString()
    };

    // Enviar datos del medicamento
    fetch(`https://hl7-fhir-ehr-vane.onrender.com/patient/${patientId}/medications`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(medicationData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Medication registered:', data);
        alert('Medicamento registrado en la historia clínica!');
        document.getElementById('medicationForm').reset();
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error al registrar el medicamento.');
    });
});
