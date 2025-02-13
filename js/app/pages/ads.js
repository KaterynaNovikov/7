export const ads = {
    data: function() {
      return {
        parent: "",
        data: {},
        loader: 1
      };
    },
    mounted: function() {
      this.parent = this.$parent.$parent; 
      
      if (!this.parent.user) {
        this.parent.logout();
      }
  
      this.get();
    },
    methods: {
      get: function() {
        var self = this;
        var data = self.parent.toFormData(self.parent.formData);
        
        data.append('uid', this.parent.user.id); 
        data.append('type', 'user');
        
        self.loader = 1;
  
        axios.post(this.parent.url +"/site/getBanners?auth=" + this.parent.user.auth, data)
          .then(function(response) {
            self.loader = 0;
            self.data = response.data;
          })
          .catch(function(error) {
            self.parent.logout();
          });
      },
      
      copy: async function(text) {
        if (navigator && navigator.clipboard) {
          await navigator.clipboard.writeText(text);
          this.$refs.header.$refs.msg.successFun("Successfully copied!");
        } else {
          this.$refs.header.$refs.msg.alertFun("Use https!");
        }
      }
    },

  template: `
  <div class="campaigns-page">
  <div class="inside-content"></div>
   <header class="header">
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
  <popup ref="copy" title="Copy banner!">
  <div class="form inner-form">
    <form v-if="parent.formData">
      <div class="row">
        <label>Code</label>
        <textarea v-model="parent.formData.copy"></textarea>
      </div>

      <div class="row">
        <label>Type</label>
        <select v-model="type" @change="get()" required>
          <option value="0"></option>
          <option v-if="data.types" v-for="c in data.types" :value="c.id">
            {{ c.title }}
          </option>
        </select>
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
        <th class="image"></th>
        <th class="image">Campaign</th>
        <th>Link</th>
        <th class="actions">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in data.items" :key="item.id">
        <td class="id">{{ item.id }}</td>
        <td class="image">
          <a href="#" @click.prevent="parent.formData = item; $refs.new.active = 1;">
            <img :src="parent.url + item.img" />
          </a>
        </td>
        <td class="image">
          <a href="#" @click.prevent="parent.formData = item; $refs.new.active = 1;">
            {{ item.campaign_title }}
          </a>
        </td>
        <td>
          <a href="#" @click.prevent="parent.formData = item; $refs.new.active = 1;">
            {{ item.link }}
          </a>
        </td>
        <td class="actions">
          <a href="#" @click.prevent="parent.formData = item; $refs.copy.active = 1;">
            <i class="fas fa-copy"></i>
          </a>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<div class="empty" v-if="!data.items || data.items.length === 0">
  No items
</div>
`,
};
