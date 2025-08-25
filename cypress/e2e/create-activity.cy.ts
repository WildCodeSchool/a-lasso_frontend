import { loginAsAssociation } from '../helpers/login';
import 'cypress-file-upload';

describe('As an association, create a new activity', () => {
    it('Connect', () => {
        loginAsAssociation();

        cy.contains('Publier une activitée 🚀').should('be.visible');
        cy.get('#create-activity-btn').click();

        // Ajouter photo existante
        cy.get('#photo-box-0').click();
        cy.get('#load-more-pictures-button').click();
        cy.get('#existing-photo-3')
            .scrollIntoView()
            .should('be.visible')
            .click();


        // Ajouter nouvelle photo locale
        cy.get('#photo-box-1').click();
        cy.get('#add-new-photo-button').click();
        cy.get('#file-input-1').attachFile('spa.jpg', { force: true });

        // Valider le recadrage
        cy.contains('button', 'Valider').click();

        // Vérifier que la photo est bien visible dans la box
        cy.get('#photo-box-1 img').should('be.visible');


        // Remplir le formulaire
        cy.fixture('activityCreation.json').then((activity) => {
            cy.get('#input_title').type(activity.title);
            cy.get('#input_requestedVolunteers').type(activity.requestedVolunteers.toString());
            cy.get('#input_date').type(activity.date);
            cy.get('#input_hour').type(activity.time);



            cy.get('#search-address-input input')
                .focus()
                .type(activity.address, { delay: 100 });

            cy.get('#search-address-input_0').should('be.visible')
            .click();  

        
            cy.get('#textarea-field').type(activity.description);

         
            cy.contains('button', activity.themes[0]).click();
            cy.contains('button', activity.themes[1]).click();

               // Soumettre le formulaire
            cy.contains('button', "Publier").click();




        });
    });

})



