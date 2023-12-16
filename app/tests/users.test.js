const request = require('supertest');
const bcrypt = require('bcrypt');
const db = require('../models/index'); // Mettez à jour le chemin si nécessaire
const app = require('../server.js'); // Mettez à jour le chemin si nécessaire

const User = db.User;
const Address = db.Address;

describe('API /users', () => {
    let server, testUserId, testAddressId;

    beforeAll(() => {
        server = app.listen(4000); // Utilisez un port différent pour les tests
    });

    afterAll(() => {
        server.close();
    });

    beforeEach(async () => {
        // Création d'un utilisateur de test
        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = await User.create({
            username: 'testuser',
            fullName: 'Test User',
            email: 'testuser@example.com',
            phoneNumber: '1234567890',
            password: hashedPassword
        });
        testUserId = user.id;

        // Création d'une adresse de test
        const address = await Address.create({
            street: '123 Test Street',
            city: 'Test City',
            zipCode: '12345',
            country: 'Testland',
            UserId: testUserId
        });
        testAddressId = address.id;
    });

    afterEach(async () => {
        await Address.destroy({ where: { UserId: testUserId } });
        await User.destroy({ where: { id: testUserId } });
    });

    it('GET /users/:userId/addresses - Récupérer les adresses d\'un utilisateur', async () => {
        const response = await request(app).get(`/users/${testUserId}/addresses`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({ street: '123 Test Street' })
        ]));
    });

    it('POST /users/:userId/addresses - Ajouter une adresse à un utilisateur', async () => {
        const newAddress = {
            street: '456 New Street',
            city: 'New City',
            zipCode: '54321',
            country: 'Newland'
        };

        const response = await request(app)
            .post(`/users/${testUserId}/addresses`)
            .send(newAddress);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('street', '456 New Street');
    });

    it('PUT /addresses/:addressId - Mettre à jour une adresse', async () => {
        const updatedAddress = {
            street: '789 Updated Street',
            city: 'Updated City',
            zipCode: '67890',
            country: 'Updatedland'
        };

        const response = await request(app)
            .put(`/addresses/${testAddressId}`)
            .send(updatedAddress);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('street', '789 Updated Street');
    });

    it('DELETE /addresses/:addressId - Supprimer une adresse', async () => {
        const response = await request(app).delete(`/addresses/${testAddressId}`);
        expect(response.statusCode).toBe(204);
    });
    // ...

// Test pour la création d'un utilisateur
it('POST /users - Créer un utilisateur', async () => {
  const newUser = {
      username: 'newUser',
      fullName: 'New User',
      email: 'newuser@example.com',
      phoneNumber: '1234567890',
      password: 'newPassword123'
  };

  const response = await request(app)
      .post('/users')
      .send(newUser);

  expect(response.statusCode).toBe(201);
  expect(response.body).toHaveProperty('username', 'newUser');

  // Nettoyage: Supprimer l'utilisateur créé pour ce test
  const createdUserId = response.body.id;
  await User.destroy({ where: { id: createdUserId } });
});

// Test pour la connexion d'un utilisateur
it('POST /login - Connexion d\'un utilisateur', async () => {
  const credentials = {
      username: 'testuser', // Utiliser le nom d'utilisateur de l'utilisateur de test
      password: 'password123'
  };

  const response = await request(app)
      .post('/login')
      .send(credentials);

  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty('message', 'Connexion réussie');
});

// Test pour le changement de mot de passe
it('POST /change-password/:userId - Changement de mot de passe d\'un utilisateur', async () => {
  const passwordData = {
      oldPassword: 'password123',
      newPassword: 'newPassword123'
  };

  const response = await request(app)
      .post(`/change-password/${testUserId}`)
      .send(passwordData);

  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty('message', 'Mot de passe mis à jour avec succès');
});

// Test pour la suppression d'un utilisateur
it('DELETE /users/:userId - Supprimer un utilisateur', async () => {
  const response = await request(app).delete(`/users/${testUserId}`);
  expect(response.statusCode).toBe(204);
});

// ...


});

// const request = require('supertest');
// const app = require('../server.js'); // Mettez à jour le chemin
// const db = require('../models/index');
// const { sequelize } = db;
// const bcrypt = require('bcrypt');
// let server;


// const User = db.User;

// describe('API /users', () => {
//     let testUserId;


  
//     beforeAll(() => {
//       server = app.listen(4000); // Démarrer le serveur sur un port spécifique pour les tests
//     });
  
//     afterAll(() => {
//       server.close(); // Fermer le serveur après les tests
//     });
    



//     afterEach(async () => {
//         // Supprimer l'utilisateur de test
//         if (testUserId) {
//           await User.destroy({ where: { id: testUserId } });
//         }
//       });

//   it('POST /users - Créer un utilisateur', async () => {
//     const newUser = {
//       username: 'testUser',
//       fullName: 'Test User',
//       email: 'test@example.com',
//       phoneNumber: '1234567890',
//       // shippingAddress: '123 Test Street, Test City',

//       password: 'password123'
//     };


//     const response = await request(app)
//       .post('/users')
//       .send(newUser);

//     expect(response.statusCode).toBe(201);
//     testUserId = response.body.id;

//     // Autres assertions...
//   });

//     // Test pour récupérer un utilisateur par ID
//     it('GET /users/:userId - Récupérer un utilisateur', async () => {
//       const newUser = {
//         username: 'testUser',
//         fullName: 'Test User',
//         email: 'test@example.com',
//         phoneNumber: '1234567890',
//         // shippingAddress: '123 Test Street, Test City',
//         password: 'password123'
//       };
  
//       const createdUser = await User.create(newUser);
//       testUserId = createdUser.id;

//         const userId = testUserId; // Assurez-vous que cet utilisateur existe
//         const response = await request(app).get(`/users/${userId}`);
    
//         expect(response.statusCode).toBe(200);
//         expect(response.body).toHaveProperty('id', userId);
//         // Autres assertions...
//       });
    
//       it('PUT /users/:userId - Mettre à jour un utilisateur', async () => {
//         const newUser = {
//           username: 'testUser',
//           fullName: 'Test User',
//           email: 'test@example.com',
//           phoneNumber: '1234567890',
//           // shippingAddress: '123 Test Street, Test City',
//           password: 'password123'
//         };
    
//         const createdUser = await User.create(newUser);
//         testUserId = createdUser.id;
//         const userId = testUserId; // Assurez-vous que cet utilisateur existe
//         const updatedUser = {
//           username: 'Updated testUser',
//           fullName: 'Updated Test User',
//           email: 'Updatedtest@example.com',
//           phoneNumber: '0987654321',
//           // shippingAddress: 'Updated 123 Test Street',
//           // ...autres champs à mettre à jour
//         };
    
//         const response = await request(app)
//           .put(`/users/${userId}`)
//           .send(updatedUser);
    
//         expect(response.statusCode).toBe(200);
//         expect(response.body.message).toBe('Utilisateur mis à jour avec succès');
//         // Autres assertions...
//       });
    
//       it('POST /login - Connexion d\'un utilisateur', async () => {
//         // Créer un utilisateur spécifique pour ce test
//         const hashedPassword = await bcrypt.hash('loginPassword123', 10);

//         const testUser = {
//           username: 'loginTestUser',
//           fullName: 'Login Test User',
//           email: 'login_test@example.com',
//           phoneNumber: '1234567890',
//           // shippingAddress: '123 Login Street, Test City',
//           password: hashedPassword
//         };
      
//         const createdUser = await User.create(testUser);
//         createdUserId = createdUser.id; // Sauvegarder l'ID pour la suppression
      
//         // Test de la connexion
//         const credentials = {
//           username: 'loginTestUser',
//           password: 'loginPassword123'
//         };
      
//         const response = await request(app)
//           .post('/login')
//           .send(credentials);
      
//         expect(response.statusCode).toBe(200);
//         expect(response.body.message).toBe('Connexion réussie');
      
//         // Supprimer l'utilisateur créé pour ce test
//         if (createdUserId) {
//           await User.destroy({ where: { id: createdUserId } });
//         }
//       });

    
//       // Test pour la connexion
//       // it('POST /login - Connexion d\'un utilisateur', async () => {

//       //   const credentials = {
//       //       username: 'anouar',
//       //       password: 'anouar'
//       //   };
    
//       //   const response = await request(app)
//       //     .post('/login')
//       //     .send(credentials);
    
//       //   expect(response.statusCode).toBe(200);
//       //   expect(response.body.message).toBe('Connexion réussie');
//       //   // Autres assertions...
//       // });


//       it('DELETE /users/:userId - Supprimer un utilisateur', async () => {
//         const newUser = {
//           username: 'testUser',
//           fullName: 'Test User',
//           email: 'test@example.com',
//           phoneNumber: '1234567890',
//           // shippingAddress: '123 Test Street, Test City',
//           password: 'password123'
//         };
    
//         const createdUser = await User.create(newUser);
//         testUserId = createdUser.id;
//         const userId = testUserId; // Assurez-vous que cet utilisateur existe
//         const response = await request(app).delete(`/users/${userId}`);
    
//         expect(response.statusCode).toBe(204);
//         // Autres assertions...
//       });
//       it('POST /change-password/:userId - Changement de mot de passe d\'un utilisateur', async () => {
//         // Créer un utilisateur pour le test
//         const hashedPassword = await bcrypt.hash('oldPassword123', 10);
//         const testUser = {
//             username: 'changePassUser',
//             fullName: 'Change Pass User',
//             email: 'change_pass@example.com',
//             phoneNumber: '1234567890',
//             // shippingAddress: '123 Change Pass Street',
//             password: hashedPassword
//         };
    
//         const createdUser = await User.create(testUser);
//         testUserId = createdUser.id;
    
//         // Données pour le changement de mot de passe
//         const passwordData = {
//             oldPassword: 'oldPassword123',
//             newPassword: 'newPassword123'
//         };
    
//         // Envoi de la requête de changement de mot de passe
//         const response = await request(app)
//           .post(`/change-password/${testUserId}`)
//           .send(passwordData);
    
//         expect(response.statusCode).toBe(200); // Assurez-vous que cela correspond à votre implémentation
//         expect(response.body.message).toBe('Mot de passe mis à jour avec succès');
    
//         // Nettoyage: Supprimer l'utilisateur de test
//         await User.destroy({ where: { id: testUserId } });
//     });
    
//     it('GET /users/:userId/addresses - Récupérer les adresses d\'un utilisateur', async () => {
//       // Créer un utilisateur pour le test
//       const testUser = {
//         username: 'addressUser',
//         fullName: 'Address User',
//         email: 'address_user@example.com',
//         phoneNumber: '1234567890',
//         password: 'password123'
//       };
    
//       const createdUser = await User.create(testUser);
//       testUserId = createdUser.id;
    
//       // Ajouter une adresse pour le test
//       await Address.create({
//         street: '123 Test Street',
//         city: 'Test City',
//         zipCode: '12345',
//         country: 'Test Country',
//         UserId: testUserId
//       });
    
//       const response = await request(app).get(`/users/${testUserId}/addresses`);
//       expect(response.statusCode).toBe(200);
//       expect(response.body).toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({
//             street: '123 Test Street',
//             city: 'Test City',
//             country: 'Test Country',
//             UserId: testUserId
//             // ... autres champs
//           })
//         ])
//       );
    
//       // Nettoyage
//       await User.destroy({ where: { id: testUserId } });
      
//     });
//     it('POST /users/:userId/addresses - Ajouter une adresse à un utilisateur', async () => {
//       const newAddress = {
//         street: '123 New Street',
//         city: 'New City',
//         zipCode: '54321',
//         country: 'New Country'
//       };
    
//       const response = await request(app)
//         .post(`/users/${testUserId}/addresses`)
//         .send(newAddress);
    
//       expect(response.statusCode).toBe(201);
//       expect(response.body).toHaveProperty('street', '123 New Street');
//       // Autres assertions...
    
//       // Nettoyage
//       const createdAddressId = response.body.id;
//       await Address.destroy({ where: { id: createdAddressId } });
//     });
//     it('PUT /addresses/:addressId - Mettre à jour une adresse', async () => {
//       // Supposons que vous avez une adresse existante avec un `id` spécifique
//       const updatedAddress = {
//         street: '456 Updated Street',
//         city: 'Updated City',
//         zipCode: '67890',
//         country: 'Updated Country'
//       };
    
//       const response = await request(app)
//         .put(`/addresses/${existingAddressId}`) // Remplacez par l'ID de l'adresse existante
//         .send(updatedAddress);
    
//       expect(response.statusCode).toBe(200);
//       expect(response.body).toHaveProperty('street', '456 Updated Street');
//       // Autres assertions...
//     });
//     it('DELETE /addresses/:addressId - Supprimer une adresse', async () => {
//       // Supposons que vous avez une adresse existante avec un `id` spécifique
//       const response = await request(app).delete(`/addresses/${existingAddressId}`);
    
//       expect(response.statusCode).toBe(204);
//       // Autres assertions...
//     });
                

//   // Ajoutez des tests pour GET, PUT, DELETE, etc.
// });

