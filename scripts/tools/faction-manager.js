(function () {
    // Faction Manager Code
    let facmanFactions = [];

    const facmanCreateFactionBtn = document.querySelector('.facman-create-faction-btn');
    const facmanFactionCardsWrapper = document.querySelector('.facman-faction-cards-wrapper');
    const facmanPrevBtn = document.querySelector('.facman-prev-btn');
    const facmanNextBtn = document.querySelector('.facman-next-btn');

    let facmanCurrentIndex = 0;

    facmanCreateFactionBtn.addEventListener('click', function () {
        facmanCreateFactionCard();
        facmanUpdateCarousel();
    });

    facmanPrevBtn.addEventListener('click', function () {
        if (facmanCurrentIndex > 0) {
            facmanCurrentIndex--;
            facmanUpdateCarousel();
        }
    });

    facmanNextBtn.addEventListener('click', function () {
        if (facmanCurrentIndex < facmanFactions.length - 1) {
            facmanCurrentIndex++;
            facmanUpdateCarousel();
        }
    });

    function facmanUpdateCarousel() {
        const offset = -facmanCurrentIndex * facmanFactionCardsWrapper.clientWidth;
        facmanFactionCardsWrapper.style.transform = `translateX(${offset}px)`;
    }

    function facmanCreateFactionCard(facmanFactionData = {}) {
        const card = document.createElement('div');
        card.className = 'facman-faction-card';

        // Default fields
        const defaultFields = [
            'Faction Name',
            'Size',
            'Motto',
            'Description',
            'Allies'
        ];

        // Create fields container
        const fieldsContainer = document.createElement('div');
        fieldsContainer.className = 'facman-fields-container';

        defaultFields.forEach(fieldName => {
            const fieldRow = facmanCreateField(fieldName, facmanFactionData[fieldName] || '');
            fieldsContainer.appendChild(fieldRow);
        });

        card.appendChild(fieldsContainer);

        // Custom fields
        if (facmanFactionData.customFields) {
            facmanFactionData.customFields.forEach(customField => {
                const fieldRow = facmanCreateField(customField.name, customField.value, true);
                fieldsContainer.appendChild(fieldRow);
            });
        }

        // Add Field button
        const addFieldBtn = document.createElement('button');
        addFieldBtn.className = 'facman-add-field-btn';
        addFieldBtn.textContent = 'Add Field';
        card.appendChild(addFieldBtn);

        addFieldBtn.addEventListener('click', function () {
            const fieldRow = facmanCreateField('', '', true);
            fieldsContainer.appendChild(fieldRow);
        });

        // Toggle Edit/View button
        const toggleEditBtn = document.createElement('button');
        toggleEditBtn.className = 'facman-toggle-edit-btn';
        toggleEditBtn.textContent = 'Save';

        card.appendChild(toggleEditBtn);

        let isEditing = true;
        toggleEditBtn.addEventListener('click', function () {
            isEditing = !isEditing;
            facmanToggleEditMode(card, isEditing);
            toggleEditBtn.textContent = isEditing ? 'Save' : 'Edit';
        });

        // Membership management
        const membershipSection = facmanCreateMembershipSection(facmanFactionData.membership || {});
        card.appendChild(membershipSection);

        facmanFactionCardsWrapper.appendChild(card);
        facmanFactions.push(facmanFactionData);

        // Initially in edit mode
        facmanToggleEditMode(card, true);

        // Update index to the latest card
        facmanCurrentIndex = facmanFactions.length - 1;
        facmanUpdateCarousel();
    }

    function facmanCreateField(labelText, valueText, isCustom = false) {
        const fieldRow = document.createElement('div');
        fieldRow.className = 'facman-field-row';

        const labelInput = document.createElement('input');
        labelInput.type = 'text';
        labelInput.placeholder = 'Field Name';
        labelInput.value = labelText;

        const valueInput = document.createElement('input');
        valueInput.type = 'text';
        valueInput.placeholder = 'Value';
        valueInput.value = valueText;

        fieldRow.appendChild(labelInput);
        fieldRow.appendChild(valueInput);

        if (isCustom) {
            const removeFieldBtn = document.createElement('span');
            removeFieldBtn.className = 'facman-remove-field-btn';
            removeFieldBtn.textContent = '✖';
            fieldRow.appendChild(removeFieldBtn);

            removeFieldBtn.addEventListener('click', function () {
                fieldRow.remove();
            });
        }

        return fieldRow;
    }

    function facmanToggleEditMode(card, isEditing) {
        const inputs = card.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.disabled = !isEditing;
        });

        const removeFieldBtns = card.querySelectorAll('.facman-remove-field-btn');
        removeFieldBtns.forEach(btn => {
            btn.style.display = isEditing ? 'inline' : 'none';
        });

        const addFieldBtn = card.querySelector('.facman-add-field-btn');
        addFieldBtn.style.display = isEditing ? 'inline-block' : 'none';

        const membershipSection = card.querySelector('.facman-membership-section');
        const membershipControls = membershipSection.querySelectorAll('.facman-add-tier-btn, .facman-add-member-btn, .facman-move-member-select, .facman-remove-member-btn, .facman-remove-tier-btn');
        membershipControls.forEach(control => {
            control.style.display = isEditing ? 'inline-block' : 'none';
        });

        const fieldsContainer = card.querySelector('.facman-fields-container');
        const fieldRows = fieldsContainer.querySelectorAll('.facman-field-row');

        if (!isEditing) {
            // Save data
            const facmanFactionData = {};
            const customFields = [];

            fieldRows.forEach(row => {
                const inputs = row.querySelectorAll('input');
                const fieldName = inputs[0].value;
                const fieldValue = inputs[1].value;

                if (['Faction Name', 'Size', 'Motto', 'Description', 'Allies'].includes(fieldName)) {
                    facmanFactionData[fieldName] = fieldValue;
                } else {
                    customFields.push({
                        name: fieldName,
                        value: fieldValue
                    });
                }
            });

            facmanFactionData.customFields = customFields;

            // Save membership data
            const membershipData = facmanCollectMembershipData(membershipSection);
            facmanFactionData.membership = membershipData;

            // Update the factions array
            const factionIndex = Array.from(facmanFactionCardsWrapper.children).indexOf(card);
            facmanFactions[factionIndex] = facmanFactionData;

            // Replace inputs with labels for view mode
            fieldRows.forEach(row => {
                const inputs = row.querySelectorAll('input');
                const fieldName = inputs[0].value;
                const fieldValue = inputs[1].value;

                row.innerHTML = '';

                const label = document.createElement('div');
                label.className = 'facman-field-label';
                label.textContent = fieldName + ':';
                row.appendChild(label);

                const value = document.createElement('div');
                value.className = 'facman-field-value';
                value.textContent = fieldValue;
                row.appendChild(value);
            });
        } else {
            // Convert labels back to inputs for edit mode
            fieldRows.forEach(row => {
                const fieldLabel = row.querySelector('.facman-field-label');
                const fieldValue = row.querySelector('.facman-field-value');

                const fieldName = fieldLabel.textContent.replace(':', '');
                const fieldVal = fieldValue.textContent;

                row.innerHTML = '';

                const labelInput = document.createElement('input');
                labelInput.type = 'text';
                labelInput.placeholder = 'Field Name';
                labelInput.value = fieldName;

                const valueInput = document.createElement('input');
                valueInput.type = 'text';
                valueInput.placeholder = 'Value';
                valueInput.value = fieldVal;

                row.appendChild(labelInput);
                row.appendChild(valueInput);

                // Remove button only if custom field
                if (!['Faction Name', 'Size', 'Motto', 'Description', 'Allies'].includes(fieldName)) {
                    const removeFieldBtn = document.createElement('span');
                    removeFieldBtn.className = 'facman-remove-field-btn';
                    removeFieldBtn.textContent = '✖';
                    row.appendChild(removeFieldBtn);

                    removeFieldBtn.addEventListener('click', function () {
                        row.remove();
                    });
                }
            });
        }
    }

    // Membership management functions
    function facmanCreateMembershipSection(membershipData) {
        const membershipSection = document.createElement('div');
        membershipSection.className = 'facman-membership-section';

        const membershipHeader = document.createElement('h3');
        membershipHeader.textContent = 'Membership';
        membershipSection.appendChild(membershipHeader);

        // Tiers container
        const tiersContainer = document.createElement('div');
        tiersContainer.className = 'facman-tiers-container';

        // Load existing tiers if any
        if (membershipData.tiers) {
            membershipData.tiers.forEach(tierData => {
                const tier = facmanCreateTier(tierData.name, tierData.members);
                tiersContainer.appendChild(tier);
            });
        }

        membershipSection.appendChild(tiersContainer);

        // Add Tier button
        const addTierBtn = document.createElement('button');
        addTierBtn.className = 'facman-add-tier-btn';
        addTierBtn.textContent = 'Add Tier';
        membershipSection.appendChild(addTierBtn);

        addTierBtn.addEventListener('click', function () {
            openModal('Add Tier', function (tierName) {
                if (tierName) {
                    const tier = facmanCreateTier(tierName, []);
                    tiersContainer.appendChild(tier);
                }
            });
        });

        return membershipSection;
    }

    function facmanCreateTier(tierName, members) {
        const tier = document.createElement('div');
        tier.className = 'facman-tier';

        const tierHeader = document.createElement('div');
        tierHeader.className = 'facman-tier-header';

        const tierNameElem = document.createElement('h4');
        tierNameElem.textContent = tierName;

        const tierControls = document.createElement('div');
        tierControls.className = 'facman-tier-controls';

        const removeTierBtn = document.createElement('button');
        removeTierBtn.className = 'facman-remove-tier-btn';
        removeTierBtn.textContent = '✖';

        tierControls.appendChild(removeTierBtn);

        removeTierBtn.addEventListener('click', function () {
            tier.remove();
        });

        tierHeader.appendChild(tierNameElem);
        tierHeader.appendChild(tierControls);

        tier.appendChild(tierHeader);

        // Members list
        const membersList = document.createElement('ul');
        membersList.className = 'facman-tier-members';

        // Load existing members
        members.forEach(memberName => {
            const memberItem = facmanCreateMember(memberName, tier);
            membersList.appendChild(memberItem);
        });

        tier.appendChild(membersList);

        // Add Member button
        const addMemberBtn = document.createElement('button');
        addMemberBtn.className = 'facman-add-member-btn';
        addMemberBtn.textContent = 'Add Member';

        addMemberBtn.addEventListener('click', function () {
            openModal('Add Member', function (memberName) {
                if (memberName) {
                    const memberItem = facmanCreateMember(memberName, tier);
                    membersList.appendChild(memberItem);
                }
            });
        });

        tier.appendChild(addMemberBtn);

        return tier;
    }

    function facmanCreateMember(memberName, currentTier) {
        const memberItem = document.createElement('li');

        const memberNameElem = document.createElement('div');
        memberNameElem.className = 'facman-member-name';
        memberNameElem.textContent = memberName;

        const memberControls = document.createElement('div');
        memberControls.className = 'facman-member-controls';

        // Move member select
        const moveMemberSelect = document.createElement('select');
        moveMemberSelect.className = 'facman-move-member-select';

        const optionDefault = document.createElement('option');
        optionDefault.value = '';
        optionDefault.textContent = 'Move to...';
        moveMemberSelect.appendChild(optionDefault);

        // Populate tiers excluding current tier
        const allTiers = currentTier.parentElement.querySelectorAll('.facman-tier');
        allTiers.forEach(tier => {
            if (tier !== currentTier) {
                const tierName = tier.querySelector('.facman-tier-header h4').textContent;
                const option = document.createElement('option');
                option.value = tierName;
                option.textContent = tierName;
                moveMemberSelect.appendChild(option);
            }
        });

        moveMemberSelect.addEventListener('change', function () {
            const selectedTierName = moveMemberSelect.value;
            if (selectedTierName) {
                // Find the selected tier
                const allTiers = currentTier.parentElement.querySelectorAll('.facman-tier');
                const selectedTier = Array.from(allTiers).find(tier => {
                    return tier.querySelector('.facman-tier-header h4').textContent === selectedTierName;
                });

                // Move member to selected tier
                const membersList = selectedTier.querySelector('.facman-tier-members');
                membersList.appendChild(memberItem);
                moveMemberSelect.value = '';
            }
        });

        // Remove member button
        const removeMemberBtn = document.createElement('button');
        removeMemberBtn.className = 'facman-remove-member-btn';
        removeMemberBtn.textContent = '✖';

        removeMemberBtn.addEventListener('click', function () {
            memberItem.remove();
        });

        memberControls.appendChild(moveMemberSelect);
        memberControls.appendChild(removeMemberBtn);

        memberItem.appendChild(memberNameElem);
        memberItem.appendChild(memberControls);

        return memberItem;
    }

    function facmanCollectMembershipData(membershipSection) {
        const tiers = [];
        const tierElements = membershipSection.querySelectorAll('.facman-tier');

        tierElements.forEach(tierElement => {
            const tierName = tierElement.querySelector('.facman-tier-header h4').textContent;
            const members = [];
            const memberItems = tierElement.querySelectorAll('.facman-tier-members li .facman-member-name');

            memberItems.forEach(memberItem => {
                members.push(memberItem.textContent);
            });

            tiers.push({
                name: tierName,
                members: members
            });
        });

        return { tiers: tiers };
    }

    // Modal functions
    const modal = document.getElementById('facman-modal');
    const modalCloseBtn = document.getElementById('facman-modal-close-btn');
    const modalBody = document.getElementById('facman-modal-body');

    function openModal(title, callback) {
        modalBody.innerHTML = '';

        const titleElem = document.createElement('h3');
        titleElem.textContent = title;
        modalBody.appendChild(titleElem);

        const input = document.createElement('input');
        input.type = 'text';
        modalBody.appendChild(input);

        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'Submit';
        submitBtn.style.marginTop = '20px';
        modalBody.appendChild(submitBtn);

        submitBtn.addEventListener('click', function () {
            const value = input.value.trim();
            modal.classList.remove('active');
            callback(value);
        });

        modal.classList.add('active');
        input.focus();
    }

    modalCloseBtn.addEventListener('click', function () {
        modal.classList.remove('active');
    });

    // Close modal on outside click
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });

})();
