export const sites = {
    data: function() {
      return {
        parent: "",
        data: {},
        date: "",
        date2: "",
        loader: 1
      };
    },
    
    mounted: function() {
      this.parent = this.$parent.Sparent;
      if (!this.parent.user) {
        this.parent.logout();
      }
      this.get();
      this.GetFirstAndLastDate();
    },
  
    methods: {
      GetFirstAndLastDate: function() {
        var year = new Date().getFullYear();
        var month = new Date().getMonth();
        var firstDayOfMonth = new Date(year, month, 2);
        var lastDayOfMonth = new Date(year, month + 1, 1);
        
        this.date = firstDayOfMonth.toISOString().substring(0, 10);
        this.date2 = lastDayOfMonth.toISOString().substring(0, 10); 
      },
      
      get: function() {
        var self = this;
        var data = self.parent.toFormData(self.parent.formData);
        data.append('uid', this.parent.user.id);
        if (this.date !== "") data.append('date', this.date);
        if (this.date2 !== "") data.append('date2', this.date2);
  
        self.loader = 1;
        axios.post("/site/getSites?auth=" + this.parent.user.auth, data)
          .then(function(response) {
            self.loader = 0;
            self.data = response.data;
          })
          .catch(function(error) {
            self.parent.logout();
          });
      },
  
      action: function() {
        var self = this;
        var data = self.parent.toFormData(self.parent.formData);
        axios.post(this.parent.url + "/site/actionSite?auth=" + this.parent.user.auth, data)
          .then(function(response) {
            if (self.parent.formData.id) {
              self.$refs.header.$refs.msg.successFun("Successfully updated site!");
            } else {
              self.$refs.header.$refs.msg.successFun("Successfully added new site!");
              self.get();
            }
          })
          .catch(function(error) {
            console.log('errors: ', error);
          });
      }
    },

template: `
  <div class="campaigns-page">
    <div class="inside-content"></div>
     <header class="header">
    <div class="flex panel">
  <div class="w20 ptb30">
    <h1>Sites</h1>
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
</div>
 </header >
<popup ref="copy" title="Copy banner">
  <div class="form inner-form">
    <form v-if="parent.formData">
      <div class="row">
        <label>Code</label>
        <textarea v-model="parent.formData.copy"></textarea>
      </div>
      <div class="row">
        <button class="btn" @click.prevent="copy(parent.formData.copy)">Copy code</button>
      </div>
    </form>
  </div>
</popup>

<div class="table" v-if="data.items && data.items.length > 0">
  <table>
    <thead>
      <tr>
        <th class="id">#</th>
        <th class="id">Views</th>
        <th class="id">Clicks</th>
        <th class="id">Leads</th>
        <th class="id">Fraud clicks</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in data.items" :key="item.id">
        <td class="id">
          <toggle v-model="item.published" @update:modelValue="item.published = $event; parent.formData = item; action()">
          </toggle>
        </td>
        <td class="image">{{ item.site }}</td>
        <td class="id">{{ item.views }}</td>
        <td class="id">
          <template v-if="item.clicks">{{ item.clicks }}</template>
          <template v-if="!item.clicks">0</template>
        </td>
        <td class="id">
          <template v-if="item.leads">{{ item.leads }}</template>
          <template v-if="!item.leads">0</template>
        </td>
        <td class="id">
          <template v-if="item.fclicks">{{ item.fclicks }}</template>
          <template v-if="!item.fclicks">0</template>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<div class="empty" v-if="!data.items || data.items.length === 0">
  No items
</div>
        </div>
</div>


  `,
};
