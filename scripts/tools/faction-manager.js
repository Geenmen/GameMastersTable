function initializeFactionManager(panelContainer) {
    let facmanFactions = [];

    const facmanCreateFactionBtn = document.querySelector('.facman-create-faction-btn');
    const facmanFactionList = document.querySelector('.facman-faction-list');
    const facmanFactionCard = document.getElementById('facman-faction-card');
    const facmanFactionManager = document.querySelector('.facman-faction-manager');

    facmanCreateFactionBtn.addEventListener('click', function () {
        facmanOpenCreateFactionModal();
    });

    function facmanOpenCreateFactionModal() {
        facmanOpenModal('Create Faction', function (factionData) {
            if (factionData) {
                facmanAddFaction(factionData);
            }
        }, true);
    }

    function facmanAddFaction(factionData) {
        facmanFactions.push(factionData);
        facmanRenderFactionList();
    }

    function facmanRenderFactionList() {
        facmanFactionList.innerHTML = '';
        facmanFactions.forEach((faction, index) => {
            const factionBtn = document.createElement('button');
            factionBtn.textContent = faction['Faction Name'] || `Faction ${index + 1}`;
            factionBtn.addEventListener('click', function () {
                facmanOpenFactionCard(index);
            });
            facmanFactionList.appendChild(factionBtn);
        });
    }

    function facmanOpenFactionCard(index) {
        const factionData = facmanFactions[index];

        facmanFactionCard.innerHTML = `
            <button class="facman-close-card-btn" id="facman-close-card-btn">✖</button>
            <h3>Faction Details</h3>
            <div id="facman-details"></div>

            <!-- Allies Section -->
            <div class="section-heading">Allies</div>
            <ul id="facman-allies-list"></ul>
            <button class="facman-add-ally-btn">Add Ally</button>

            <!-- Membership Section -->
            <div class="section-heading">Membership</div>
            <div id="facman-membership-section"></div>

            <!-- Custom Fields Section -->
            <div class="section-heading">Custom Fields</div>
            <div id="facman-custom-fields"></div>
            <button class="facman-add-field-btn">Add Custom Field</button>

            <!-- Edit Button -->
            <button class="facman-toggle-edit-btn">Edit All Details</button>
        `;

        // Close button functionality with save before close
        const closeBtn = facmanFactionCard.querySelector('#facman-close-card-btn');
        closeBtn.addEventListener('click', function () {
            facmanSaveCurrentFactionData(index);  // Save data before closing
            facmanFactionCard.classList.remove('active');
        });

        // Populate faction details
        const detailsContainer = facmanFactionCard.querySelector('#facman-details');
        const detailFields = ['Faction Name', 'Size', 'Alignment', 'Motto', 'Description'];
        detailFields.forEach(field => {
            const div = document.createElement('div');
            div.classList.add('facman-detail-item');
            div.innerHTML = `
                <label>${field}:</label>
                <span id="faction-${field.toLowerCase().replace(' ', '-')}-cell">${factionData[field]}</span>
            `;
            detailsContainer.appendChild(div);
        });

        // Allies section
        const alliesList = facmanFactionCard.querySelector('#facman-allies-list');
        const renderAllies = () => {
            alliesList.innerHTML = '';
            factionData.allies.forEach(ally => {
                const li = document.createElement('li');
                li.innerHTML = `${ally} <button class="facman-remove-ally-btn">✖</button>`;
                alliesList.appendChild(li);

                const removeAllyBtn = li.querySelector('.facman-remove-ally-btn');
                removeAllyBtn.addEventListener('click', function () {
                    li.remove();
                    factionData.allies = factionData.allies.filter(a => a !== ally);
                });
            });
        };
        renderAllies();

        const addAllyBtn = facmanFactionCard.querySelector('.facman-add-ally-btn');
        addAllyBtn.addEventListener('click', function () {
            facmanOpenModal('Add Ally', function (allyName) {
                if (allyName) {
                    factionData.allies.push(allyName);
                    renderAllies();
                }
            });
        });

        // Membership section
        const membershipSection = facmanFactionCard.querySelector('#facman-membership-section');
        const membershipElem = facmanCreateMembershipSection(factionData.membership || {});
        membershipSection.appendChild(membershipElem);

        // Custom fields
        const customFieldsContainer = facmanFactionCard.querySelector('#facman-custom-fields');
        const renderCustomFields = () => {
            customFieldsContainer.innerHTML = '';
            factionData.customFields.forEach(field => {
                const div = document.createElement('div');
                div.classList.add('facman-custom-field');
                div.innerHTML = `
                    <label>${field.name}:</label>
                    <span>${field.value}</span>
                    <button class="facman-remove-field-btn">✖</button>
                `;
                customFieldsContainer.appendChild(div);

                const removeFieldBtn = div.querySelector('.facman-remove-field-btn');
                removeFieldBtn.addEventListener('click', function () {
                    div.remove();
                    factionData.customFields = factionData.customFields.filter(f => f.name !== field.name);
                });
            });
        };
        renderCustomFields();

        const addFieldBtn = facmanFactionCard.querySelector('.facman-add-field-btn');
        addFieldBtn.addEventListener('click', function () {
            facmanOpenModal('Add Custom Field', function (fieldName) {
                if (fieldName) {
                    facmanOpenModal('Enter Value for ' + fieldName, function (fieldValue) {
                        if (fieldValue) {
                            factionData.customFields.push({ name: fieldName, value: fieldValue });
                            renderCustomFields();
                        }
                    });
                }
            });
        });

        // Toggle Edit/View button
        const toggleEditBtn = facmanFactionCard.querySelector('.facman-toggle-edit-btn');
        let isEditing = false;
        toggleEditBtn.addEventListener('click', function () {
            isEditing = !isEditing;
            facmanToggleEditMode(facmanFactionCard, isEditing, index);
            toggleEditBtn.textContent = isEditing ? 'Save' : 'Edit';
        });

        facmanFactionCard.classList.add('active');
    }

    function facmanToggleEditMode(card, isEditing, index) {
        const factionData = facmanFactions[index];
        const detailFields = ['Faction Name', 'Size', 'Alignment', 'Motto', 'Description'];

        detailFields.forEach(field => {
            const cell = card.querySelector(`#faction-${field.toLowerCase().replace(' ', '-')}-cell`);
            if (isEditing) {
                const value = cell.textContent;
                cell.innerHTML = `<input type="text" value="${value}">`;
            } else {
                const input = cell.querySelector('input');
                const value = input.value.trim();
                cell.textContent = value;
                factionData[field] = value;
            }
        });

        // Custom fields edit
        const customFieldsContainer = card.querySelector('#facman-custom-fields');
        Array.from(customFieldsContainer.children).forEach(div => {
            const span = div.querySelector('span');
            if (isEditing) {
                const value = span.textContent;
                span.innerHTML = `<input type="text" value="${value}">`;
            } else {
                const input = span.querySelector('input');
                const value = input.value.trim();
                span.textContent = value;
                const fieldName = div.querySelector('label').textContent.replace(':', '');
                const customField = factionData.customFields.find(f => f.name === fieldName);
                if (customField) {
                    customField.value = value;
                }
            }
        });

        // Allies section
        const alliesList = card.querySelector('#facman-allies-list');
        Array.from(alliesList.children).forEach(li => {
            if (isEditing) {
                const allyName = li.textContent.replace(' ✖', '');
                li.innerHTML = `<input type="text" value="${allyName}"> <button class="facman-remove-ally-btn">✖</button>`;
            } else {
                const input = li.querySelector('input');
                const allyName = input.value.trim();
                li.innerHTML = `${allyName} <button class="facman-remove-ally-btn">✖</button>`;

                factionData.allies = Array.from(alliesList.children).map(li => li.textContent.replace(' ✖', ''));
            }
        });

        // Show/hide add buttons for editing
        card.querySelector('.facman-add-ally-btn').style.display = isEditing ? 'block' : 'none';
        card.querySelector('.facman-add-field-btn').style.display = isEditing ? 'block' : 'none';
    }

    // Membership management functions
    function facmanCreateMembershipSection(membershipData) {
        const membershipSection = document.createElement('div');
        membershipSection.className = 'facman-membership-section';

        const tiersContainer = document.createElement('div');
        tiersContainer.className = 'facman-tiers-container';

        membershipData.tiers?.forEach(tierData => {
            const tier = facmanCreateTier(tierData.name, tierData.members);
            tiersContainer.appendChild(tier);
        });

        membershipSection.appendChild(tiersContainer);

        const addTierBtn = document.createElement('button');
        addTierBtn.className = 'facman-add-tier-btn';
        addTierBtn.textContent = 'Add Tier';
        membershipSection.appendChild(addTierBtn);

        addTierBtn.addEventListener('click', function () {
            facmanOpenModal('Add Tier', function (tierName) {
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

        const removeTierBtn = document.createElement('button');
        removeTierBtn.className = 'facman-remove-tier-btn';
        removeTierBtn.textContent = '✖';
        removeTierBtn.addEventListener('click', function () {
            tier.remove();
        });
        tier.appendChild(removeTierBtn);

        const tierHeader = document.createElement('div');
        tierHeader.className = 'facman-tier-header';

        const tierNameElem = document.createElement('h4');
        tierNameElem.textContent = tierName;

        tierHeader.appendChild(tierNameElem);
        tier.appendChild(tierHeader);

        const membersList = document.createElement('ul');
        members.forEach(member => {
            const memberItem = facmanCreateMember(member);
            membersList.appendChild(memberItem);
        });
        tier.appendChild(membersList);

        const addMemberBtn = document.createElement('button');
        addMemberBtn.className = 'facman-add-member-btn';
        addMemberBtn.textContent = 'Add Member';
        addMemberBtn.addEventListener('click', function () {
            facmanOpenModal('Add Member', function (memberName) {
                if (memberName) {
                    const memberItem = facmanCreateMember(memberName);
                    membersList.appendChild(memberItem);
                }
            });
        });
        tier.appendChild(addMemberBtn);

        return tier;
    }

    function facmanCreateMember(memberName) {
        const memberItem = document.createElement('li');
        memberItem.innerHTML = `${memberName} <button class="facman-remove-member-btn">✖</button>`;

        const removeMemberBtn = memberItem.querySelector('.facman-remove-member-btn');
        removeMemberBtn.addEventListener('click', function () {
            memberItem.remove();
        });

        return memberItem;
    }

    // Save the current faction's data to ensure that the membership and other details are not lost
    function facmanSaveCurrentFactionData(index) {
        const factionData = facmanFactions[index];
        const membershipSection = document.querySelector('.facman-membership-section');
        const tiersContainer = membershipSection.querySelector('.facman-tiers-container');

        // Collect membership data (tiers and members)
        const newTiers = [];
        tiersContainer.querySelectorAll('.facman-tier').forEach(tierElement => {
            const tierName = tierElement.querySelector('.facman-tier-header h4').textContent;
            const members = [];
            tierElement.querySelectorAll('li').forEach(memberElement => {
                members.push(memberElement.textContent.replace(' ✖', ''));
            });
            newTiers.push({ name: tierName, members: members });
        });

        factionData.membership.tiers = newTiers;

        // Save the updated faction data back into the array
        facmanFactions[index] = factionData;
    }

    // Modal functions
    const facmanModal = document.getElementById('facman-modal');
    const facmanModalCloseBtn = document.getElementById('facman-modal-close-btn');
    const facmanModalBody = document.getElementById('facman-modal-body');

    function facmanOpenModal(title, callback, isCreateFaction = false) {
        facmanModalBody.innerHTML = '';

        const titleElem = document.createElement('h3');
        titleElem.textContent = title;
        facmanModalBody.appendChild(titleElem);

        if (isCreateFaction) {
            const defaultFields = ['Faction Name', 'Motto', 'Description'];
            const fieldInputs = {};

            defaultFields.forEach(fieldName => {
                const input = document.createElement('input');
                input.type = 'text';
                input.placeholder = fieldName;
                facmanModalBody.appendChild(input);
                fieldInputs[fieldName] = input;
            });

            const sizes = ['Tribe', 'Village', 'Clan', 'Township', 'City', 'State', 'Region', 'Nation', 'Empire', 'World Power'];
            facmanModalBody.appendChild(facmanCreateRadioGroup('Faction Size', 'factionSize', sizes));

            const alignments = ['Chaotic Good', 'Chaotic Neutral', 'Chaotic Evil', 'Lawful Good', 'Lawful Neutral', 'Lawful Evil', 'Neutral Good', 'True Neutral', 'Neutral Evil'];
            facmanModalBody.appendChild(facmanCreateRadioGroup('Faction Alignment', 'factionAlignment', alignments));

            const submitBtn = document.createElement('button');
            submitBtn.textContent = 'Create Faction';
            facmanModalBody.appendChild(submitBtn);

            submitBtn.addEventListener('click', function () {
                const factionData = {};
                let hasName = false;

                defaultFields.forEach(fieldName => {
                    const value = fieldInputs[fieldName].value.trim();
                    if (fieldName === 'Faction Name' && value) hasName = true;
                    factionData[fieldName] = value;
                });

                if (!hasName) {
                    alert('Faction Name is required.');
                    return;
                }

                const sizeRadio = facmanModalBody.querySelector('input[name="factionSize"]:checked');
                if (sizeRadio) factionData['Size'] = sizeRadio.value;
                else {
                    alert('Faction Size is required.');
                    return;
                }

                const alignmentRadio = facmanModalBody.querySelector('input[name="factionAlignment"]:checked');
                if (alignmentRadio) factionData['Alignment'] = alignmentRadio.value;
                else {
                    alert('Faction Alignment is required.');
                    return;
                }

                factionData.membership = { tiers: [] };
                factionData.allies = [];
                factionData.customFields = [];

                facmanModal.classList.remove('active');
                callback(factionData);
            });
        } else {
            const input = document.createElement('input');
            input.type = 'text';
            facmanModalBody.appendChild(input);

            const submitBtn = document.createElement('button');
            submitBtn.textContent = 'Submit';
            facmanModalBody.appendChild(submitBtn);

            submitBtn.addEventListener('click', function () {
                const value = input.value.trim();
                if (value === '') {
                    alert('This field cannot be empty.');
                    return;
                }
                facmanModal.classList.remove('active');
                callback(value);
            });
        }

        facmanModal.classList.add('active');
    }

    facmanModalCloseBtn.addEventListener('click', function () {
        facmanModal.classList.remove('active');
    });

    // Close modal on outside click
    facmanModal.addEventListener('click', function (event) {
        if (event.target === facmanModal) {
            facmanModal.classList.remove('active');
        }
    });

    function facmanCreateRadioGroup(labelText, groupName, options) {
        const group = document.createElement('div');
        group.className = 'facman-radio-group';
        const label = document.createElement('h4');
        label.textContent = labelText;
        group.appendChild(label);

        options.forEach(option => {
            const optionLabel = document.createElement('label');
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = groupName;
            radio.value = option;
            optionLabel.appendChild(radio);
            optionLabel.appendChild(document.createTextNode(option));
            group.appendChild(optionLabel);
        });

        return group;
    }

};
