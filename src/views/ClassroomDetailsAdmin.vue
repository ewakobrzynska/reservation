<template>
<div class="d-flex justify-content-between align-items-center py-4 bg-light border-bottom mb-4">
        <div class="container d-flex justify-content-between">
          <h1 v-if="isHomePage">System Rezerwacji</h1>
          <h1 v-else>Katalog sal - szczegóły</h1>
        </div>
    </div>
    <v-card
      class="mx-auto pt-4 text-left"
      max-width="844"
    >
      <v-card-text>
        <div class="top">
              <v-btn size="35" icon="mdi-arrow-left" class="arr-btn" @click="goBack"></v-btn>
            <div class="header">
                <h1>Szczegóły sali</h1>
            </div>
        </div>

        <hr />

        <div class="details">
          <ul>
            <li> <p><strong>Strefa:</strong> {{ roomDetails.zone }} </p></li>
            <li> <p><strong>Ulica:</strong> {{ roomDetails.street }} </p></li>
            <li> <p><strong>Budynek:</strong> {{ roomDetails.building }} </p></li>
            <li> <p><strong>Jednostka organizacyjna:</strong> {{ roomDetails.organizationalUnit }} </p></li>
            <li> <p><strong>Numer sali:</strong> {{ roomDetails.roomNumber }} </p></li>
            <li> <p><strong>Liczba miejsc:</strong> {{ roomDetails.numberOfPlaces }} </p></li>
            <li> <p><strong>Opis sali:</strong> {{ roomDescription }}</p></li>
          </ul>
        </div>
      </v-card-text>
      
        <v-card-actions>
            <div class="buttons">
                <v-btn
                    text="Dodaj opis"
                    color="red-accent-3"
                    prepend-icon="mdi-pencil"
                    variant="text"
                    @click="reveal = true"
                ></v-btn>
            </div>
        </v-card-actions>
  
      <v-expand-transition>
        <v-card
          v-if="reveal"
          class="position-absolute w-100 expand"
          height="100%"
          style="bottom: 0;"
        >
          <v-card-text >
            <h1>Dodawanie opisu do sali</h1>    
          </v-card-text>

    <form @submit.prevent="submitForm">
      <div class="mb-3">
          <label for="description" class="form-label" >Opis</label>
          <input type="text" class="form-control" id="description" v-model="description">
        </div>
        <div class="mb-3">
          <label for="roomNumber" class="form-label">Numer sali</label>
          <input type="text" class="form-control" id="roomNumber" v-model="roomNumber" required>
        </div>
        <div class="mb-3">
          <label for="hasComputer" class="form-label">Wyposażenie w komputery</label>
          <select class="form-select" id="hasComputer" v-model="hasComputer">
            <option value="true">Tak</option>
            <option value="false">Nie</option>
          </select>
        </div>
      
          <v-card-actions class="form-actions"> 
            <div class="buttons">
                <v-btn type="submit" 
                    prepend-icon="mdi-checkbox-marked-circle"
                    text="Dodaj"
                    variant="text"
                    color="teal-accent-4"
                ></v-btn>
                
                <v-btn
                    prepend-icon="mdi-cancel"
                    color="red-accent-3"
                    text="Anuluj"
                    variant="text"
                    @click="reveal = false"
                ></v-btn>
              </div>
            </v-card-actions>
      </form>

        </v-card>
      </v-expand-transition>
    </v-card>

    <!-- Footer -->
    <footer class="bg-light py-4">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <h3>Lokalizacja</h3>
            <p>ul. Stanisława Łojasiewicza 11, 00-000 Kraków</p>
            <p><strong>Godziny otwarcia:</strong> Pon - Pt: 8:00 - 20:00</p>
          </div>
          <div class="col-md-6">
            <h3>Informacje kontaktowe</h3>
            <p>Email: kontakt@systemrezerwacji.pl</p>
            <p>Telefon: 123 456 789</p>
          </div>
        </div>
      </div>
    </footer>
  </template>
  
  <script>
    import { retrieveRoomData, retrieveRoomDescription } from "../../data/database.js";
import { onMounted, ref } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";
import { getDatabase, ref as dbRef, set } from "firebase/database";

    export default {
      setup(){
          const auth = getAuth();
    const router = useRouter();
    const isLoggedIn = ref(false);
    const description = ref('');
    const roomNumber = ref(null);

    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        if(user){
          isLoggedIn.value = true;
        } else {
          isLoggedIn.value = false;
        }
      });
    });
    const handleSignOut = () => {
        signOut(auth).then(() => {
          router.push("/login");
        });
    };

    const submitForm = () => {
      const db = getDatabase();
      const dataRef = dbRef(db, 'opissal/' + roomNumber.value);
      set(dataRef, {
        description: description.value,
        roomNumber: roomNumber.value,
      });
      alert('Dane zostały zapisane');
      description.value = '';
      roomNumber.value = null;
    };return {
      isLoggedIn,
      handleSignOut,
      description,
      roomNumber,
      submitForm,
    }
      },
      data: () => ({
        roomDetails: {},
        roomDescription: '',
        reveal: false,
      }),

      methods: {
        goToCalendar() {
          console.log(this.roomDetails.roomNumber);
          this.$router.push({ path: `/calendar/${this.roomDetails.roomNumber}` });
        },

        goBack() {
          this.$router.push({ path: '/classroom' });
        }
      },

      async mounted() {
        try {
          const roomNumber = this.$route.params.roomNumber;

          const data = await retrieveRoomData(roomNumber)
          this.roomDetails = data

          if (this.roomDetails.roomNumber) {
            const description = await retrieveRoomDescription(this.roomDetails.roomNumber);
            this.roomDescription = description ? description : 'Brak opisu';
          } else {
            this.roomDescription = 'Brak numeru sali';
          }

        } catch (error) {
          console.error('Error fetching room details:', error);
        }
      }
    }

  </script>
  

  <style scoped>
@import '@/css/bootstrap.min.css';
    .text-left {
        text-align: left;
        margin-top: 9rem;
        background-color: rgba(245, 245, 245, 0.332);
    }

    .header {
        text-align: center;
    }

    .arr-btn {
        position: absolute;
        left: 1rem;
        top: 1rem;
    }
    
    .pt-4 {
        margin-top: 6rem;
    }

    p {
        line-height: 2.8rem !important;
        font-size: 1.1rem;
    }

    .details {
        padding: 0 2rem;
    }

    h1, h2 {
        padding: 0.4rem 0;
    }

    .ul-details {
      line-height: 2.6rem !important;
    }

    hr {
        margin-bottom: 0.6rem;
    }

    .buttons {
        display: flex;
        margin: 1rem;
        justify-content: center;
        gap: 10%;
        width: 100%;
    }

    span {
        display: inline-block;
        margin: 1rem;
        font-size: 1.1rem;
        font-style: italic;
        color: rgba(0, 0, 0, 0.545);
    }

    .expand {
        padding: 2rem;
        text-align: center;
    }

   

  </style>
  