<script>

import {getAuth, onAuthStateChanged} from "firebase/auth";
import {onMounted, ref} from "vue";
import {myData, getHistoryReservations, retriveUserData} from "../../data/database";

export default {
  name: 'ReservationsHistoryView',
  data() {
    return {
      reservations: []
    }
  },
  setup(){
    const auth = getAuth();
    const isLoggedIn = ref(false);

    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        isLoggedIn.value = !!user;
      });
    });

    return {
      isLoggedIn
    }
  },
  created() {
    let auth;
    auth = getAuth();
    myData(retriveUserData(auth.currentUser.uid));
  },
  async mounted() {
    try {
      this.reservations = await getHistoryReservations();
      console.error(this.reservations);
    } catch (error) {
      console.error("Error while retrieving data:", error);
    }
  },
}

</script>

<template>
<div class="d-flex justify-content-between align-items-center py-4 bg-light border-bottom mb-4">
        <div class="container d-flex justify-content-between">
          <h1 v-if="isHomePage">System Rezerwacji</h1>
          <h1 v-else>Historia rezerwacji</h1>
        </div>
    </div>

  <div class="table-container">
    <table class="reservations-history-table">
      <thead>
      <tr>
        <th>Data</th>
        <th>Godziny</th>
        <th>Numer sali</th>
        <th>Nazwa rezerwacji</th>
        <th>Osoba rezerwująca</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(reservation, index) in reservations" :key="index">
        <td>{{ reservation.date }}</td>
        <td>{{ reservation.start }} - {{ reservation.finish }}</td>
        <td>{{ reservation.roomNumber }}</td>
        <td>{{ reservation.name }}</td>
        <td>{{ reservation.person }}</td>
      </tr>
      </tbody>
    </table>
  </div>
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

<style scoped>
@import '@/css/bootstrap.min.css';
.header-container {
  position: relative;
  background-color: #c5c5c5;
  height: 80px;
  width: 100%;
}

.table-container {
  margin: 40px 40px 40px 40px;
}

.reservations-history-table {
  width: 100%;
  border-collapse: collapse;
}

.reservations-history-table th,
.reservations-history-table td {
  padding: 8px;
  border: 1px solid #ddd;
}

.reservations-history-table th {
  background-color: #f2f2f2;
  text-align: left;
}

.reservations-history-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.reservations-history-table tr:hover {
  background-color: #ddd;
}
</style>