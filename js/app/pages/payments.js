export const payments = {
    data: function() {
      return {
        parent: "",
        data: {},
        loader: 1
      };
    },
  
    mounted: function() {
      this.parent = this.$parent.Sparent;
      if (!this.parent.user) {
        this.parent.logout();
      }
      this.get();
    },
  
    methods: {
      get: function() {
        var self = this;
        var data = self.parent.toFormData(self.parent.formData);
        data.append('id', this.parent.user.id);
  
        self.loader = 1;
        axios.post("/site/getPayments?auth=" + this.parent.user.auth, data)
          .then(function(response) {
            self.loader = 0;
            self.data = response.data;
          })
          .catch(function(error) {
            self.parent.logout();
          });
      }
    },
  
  template: `
  <div class="campaigns-page">
    <div class="inside-content"></div>
    <div id="spinner" v-if="loader"></div>
 <header class="header">
<div class="wrapper">
  <div class="flex panel">
    <div class="w30 ptb10">
      <h2>Payments</h2>
    </div>
    <div class="w50"></div>
    <div class="w20 ptb15 al"></div>
  </div>
  <nav class="menu">
                  <ul>
                      <li>
                          <router-link to="/users" :class="{ 'router-link-active': $route.path.includes('user') }">
                              <i class="fas fa-user"></i> Payments
                          </router-link>
                      </li>
                      <li>
                          <router-link to="/sites" :class="{ 'router-link-active': $route.path.includes('campaign') }">
                              <i class="fas fa-bullhorn"></i> Sites
                          </router-link>
                      </li>
                      <li>
                          <router-link to="/ads" :class="{ 'router-link-active': $route.path.includes('campaign') }">
                              <i class="fas fa-bullhorn"></i> Ads
                          </router-link>
                      </li>
                      <li>
                          <router-link to="/statistics" :class="{ 'router-link-active': $route.path.includes('campaign') }">
                              <i class="fas fa-bullhorn"></i> Statistics
                          </router-link>
                      </li>
                  </ul>
              </nav> 
               </header >
  <div class="table" v-if="data.items && data.items.length > 0">
    <table>
      <thead>
        <tr>
          <th class="id">#</th>
          <th class="id">Value</th>
          <th>Date</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data.items" :key="item.id">
          <td class="id">{{ item.id }}</td>
          <td class="id">
            <a href="#" @click.prevent="parent.formData = item; $refs.payment.active = 1;">
              {{ item.value }}
            </a>
          </td>
          <td>
            <a href="#" @click.prevent="parent.formData = item; $refs.payment.active = 1;">
              {{ item.date_title }}
            </a>
          </td>
          <td>{{ item.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="empty" v-if="!data.items || data.items.length === 0">
    No items
  </div>
</div>



  `,
};
