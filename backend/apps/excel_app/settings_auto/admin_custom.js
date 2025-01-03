document.addEventListener('DOMContentLoaded', function() {
    console.log('Custom admin JS loaded');
    const typeField = document.querySelector('#id_type');
    const settingsField = document.querySelector('#id_settings');

    const templates = {
        text: null,
        number: null,
        select: JSON.stringify({ inputs: [] }, null, 2),
        date: JSON.stringify({ type: "..." }, null, 2),
        default: null
    };

    function updateSettingsField() {
        const selectedType = typeField.value;
        const template = templates[selectedType] || templates.default;
        settingsField.value = template;
    }

    typeField.addEventListener('change', updateSettingsField);
    updateSettingsField();
});