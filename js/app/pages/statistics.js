export const statistics = {
    data() {
      return {
        parent: "",
        data: {},
        date: "",
        date2: "",
        loader: 1,
        type: 0,
      };
    },
    mounted() {
      this.parent = this.$parent.$parent;
  
      if (!this.parent.user) {
        this.parent.logout();
      }
  
      this.get();
      this.getFirstAndLastDate();
    },
    methods: {
      getFirstAndLastDate() {
        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
  
        this.date = firstDayOfMonth.toISOString().substring(0, 10);
        this.date2 = lastDayOfMonth.toISOString().substring(0, 10);
      },
      get() {
        const self = this;
        const data = self.parent.toFormData(self.parent.formData);
  
        data.append("id", this.parent.user.id);
        data.append("type", "user");
  
        if (this.date) data.append("date", this.date);
        if (this.date2) data.append("date2", this.date2);
        if (this.type) data.append("type", this.type);
  
        self.loader = 1;
  
        axios
          .post(this.parent.url + "/site/getStatistics?auth", data)
          .then((response) => {
            self.loader = 0;
            self.data = response.data;
  
            if (response.data.types && response.data.types[0] && !self.type) {
              self.type = response.data.types[0].id;
            }
  
            self.parent.formData.copy = self.data.multi;
          })
          .catch(() => {
            self.parent.logout();
          });
      },
      actionStatistic() {
        const self = this;
        const data = self.parent.toFormData(self.parent.formData);
  
        data.append("uid", this.parent.user.id);
  
        axios
          .post(this.parent.url + "/site/actionStatistic?auth", data)
          .then((response) => {
            if (response.data.error) {
              self.$refs.header.$refs.msg.alertFun(response.data.error);
              return;
            }
  
            const msg = self.parent.formData.id
              ? "Successfully updated banner!"
              : "Successfully added new banner!";
  
            self.$refs.header.$refs.msg.successFun(msg);
            self.get();
          })
          .catch((error) => {
            console.error("errors:", error);
          });
      },
      async copy(text) {
        if (navigator && navigator.clipboard) {
          await navigator.clipboard.writeText(text);
          this.$refs.header.$refs.msg.successFun("Successfully copied!");
        } else {
          this.$refs.header.$refs.msg.alertFun("Use HTTPS!");
        }
      },
    },
  template: `
   <div class="campaigns-page">
      <div class="inside-content">
  
          <header class="header">
              <div id="user-top" @click="toggleActive()">
                  <div id="user-circle">{{ parent.user.user[0] }}</div>
                  <div id="user-info" :class="{ active: active }">
                      <a href="#" @click.prevent="logout()">
                          <i class="fas fa-sign-out-alt"></i> Log out
                      </a>
                  </div>
              </div>
              <nav class="menu">
                  <ul :class="{'active': menu == 1}" v-if="parent.user && parent.user.type && parent.user.type !== 'admin'">
      <li v-if="menu == 1" class="al"><i class="fas fa-times" @click="menu = 0"></i></li>
      <li>
        <router-link to="/statistics">
          <i class="fas fa-chart-area"></i> Statistics
        </router-link>
      </li>
      <li>
        <router-link to="/ads">
          <i class="fas fa-image"></i> Ads
        </router-link>
      </li>
      <li>
        <router-link to="/sites">
          <i class="fab fa-chrome"></i> Sites
        </router-link>
      </li>
      <li>
        <router-link to="/payments">
          <i class="fas fa-credit-card"></i> Payments
        </router-link>
      </li>
    </ul>
              </nav>      
              <div class="logo">
                  <img src="/app/views/images/logo.svg" alt="Logo">
              </div>
  
          </header>
  <div class="w20 ptb15 al">
  <a href="#" class="btnS" @click.prevent="parent.formData.copy = data.multi; $refs.copy.active = 1;">
    <i class="fas fa-images"></i>
    Multi banners
  </a>
</div>

<popup ref="img" title="Banner">
  <div class="ac">
    <img :src="parent.formData.img" v-if="parent.formData.img" />
  </div>
</popup>

<popup ref="copy" title="Copy banner">
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
          <option v-if="data.types" v-for="c in data.types" :value="c.id">{{ c.title }}</option>
        </select>
      </div>

      <div class="row">
        <button class="btn" @click.prevent="copy(parent.formData.copy)">Copy code</button>
      </div>
    </form>
  </div>
</popup>

<div class="table" v-if="data.items && data.items.length">
  <table>
    <thead>
      <tr>
        <th class="id"></th>
        <th class="image"></th>
        <th class="image">Campaign</th>
        <th>Link</th>
        <th class="id">Views</th>
        <th class="id">Clicks</th>
        <th class="id">Leads</th>
        <th class="id">Fraud clicks</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in data.items" :key="item.id">
        <td class="id">
          <toogle :modelValue="item.published" @update:modelValue="item.published = $event; parent.formData = item; actionStatistic()" />
        </td>
        <td class="image">
          <a href="#" @click.prevent="parent.formData = item; $refs.img.active = 1">
            <img :src="item.img" />
          </a>
        </td>
        <td class="image">{{ item.campaign_title }}</td>
        <td>{{ item.link }}</td>
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

  ` ,
};