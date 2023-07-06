<template>
    <div class="profile">
      <div class="container">
        <div class="row">
          <div class="col-lg-4">
            <div class="profile-avatar">
              <img :src="user.photo" alt="Foto de perfil" class="profile-photo" />
            </div>
          </div>
          <div class="col-lg-8">
            <div class="profile-details">
              <div class="profile-info">
                <div class="profile-field">
                  <div class="profile-field-label">Nombre:</div>
                  <div class="profile-field-value">{{ user.first_name }} {{ user.last_name }}</div>
                </div>
                <div class="profile-field">
                  <div class="profile-field-label">Email:</div>
                  <div class="profile-field-value">{{ user.email }}</div>
                </div>
                <div class="profile-field">
                  <div class="profile-field-label">Dirección:</div>
                  <div class="profile-field-value">{{ user.address }}</div>
                </div>
                <div class="profile-field">
                  <div class="profile-field-label">Teléfono:</div>
                  <div class="profile-field-value">{{ user.phone }}</div>
                </div>
                <div class="profile-field">
                  <div class="profile-field-label">RUC:</div>
                  <div class="profile-field-value">{{ user.ruc }}</div>
                </div>
              </div>
              <div class="profile-actions">
                <button class="btn btn-primary profile-action-btn">Editar perfil</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Profile',
    computed: {
      user() {
        return {
        email: "admin@admin.com",
        first_name: "Jhon",
        last_name: "Mamani Mamani",
        address: "Av. En la esquina de Mar de Plata 405",
        phone: "+5194549222",
        ruc: "9712452345",
        photo: "https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo.png",
      };
      }
    }
  }
  </script>
  
  <style scoped>
  .profile {
    min-height: calc(100vh - 70px); /* Ajustar el valor 70px según la altura del encabezado de tu página */
    padding: 20px 0;
    background-color: #f8f8f8;
    display: flex;
    align-items: center;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .profile-avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 20px;
  }
  
  .profile-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .profile-details {
    display: flex;
    flex-direction: column;
  }
  
  .profile-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  
  .profile-info {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
  
  .profile-field {
    margin-bottom: 10px;
  }
  
  .profile-field-label {
    font-weight: bold;
    color: #555;
  }
  
  .profile-field-value {
    color: #888;
  }
  </style>
  