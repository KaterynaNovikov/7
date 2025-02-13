export const header = {
  data() {
    return {
      user: {},
      parent: "",
      active: 0,
      menu: 0,
    };
  },

  mounted() {
    this.parent = this.$parent?.$parent?.$parent || {};
  },

  methods: {
    toggleActive() {
      this.active = this.active === 1 ? 0 : 1;
    }
  },

  template: `
    <header class="header">
      <div class="wrapper">
        <div class="flex">
          

          <div class="w20 logo">
            <img src="/app/views/images/logo.svg" alt="Logo" />
          </div>


          <div class="w70">
            <div id="menu">
              <i class="fas fa-bars" @click="menu = 1"></i>


              <ul :class="{ active: menu === 1 }" v-if="parent.user && parent.user.type && parent.user.type === 'admin'">
                <li v-if="menu === 1" class="al"><i class="fas fa-times" @click="menu = 0"></i></li>
                <li><router-link :class="{ 'router-link-active': $route.path.includes('campaign') }" to="/campaigns"><i class="fas fa-bullhorn"></i> Campaigns</router-link></li>
                <li><router-link :class="{ 'router-link-active': $route.path.includes('user') }" to="/users"><i class="fas fa-user"></i> Users</router-link></li>
              </ul>


              <ul :class="{ active: menu === 1 }" v-if="parent.user && parent.user.type && parent.user.type !== 'admin'">
                <li v-if="menu === 1" class="al"><i class="fas fa-times" @click="menu = 0"></i></li>
                <li><router-link to="/statistics"><i class="fas fa-chart-area"></i> Statistics</router-link></li>
                <li><router-link to="/ads"><i class="fas fa-image"></i> Ads</router-link></li>
                <li><router-link to="/sites"><i class="fab fa-chrome"></i> Sites</router-link></li>
                <li><router-link to="/payments"><i class="fas fa-credit-card"></i> Payments</router-link></li>
              </ul>
            </div>
          </div>


          <div class="w10 al" id="user-top" v-if="parent.user && parent.user.user">
            <div id="user-circle" @click="toggleActive()">{{ parent.user.user[0] }}</div>
            <div id="user-info" :class="{ active: active === 1 }">
              <a href="#" @click.prevent="parent.logout()">
                <i class="fas fa-sign-out-alt"></i> {{ parent.user.user }} Log out
              </a>
            </div>
            <i @click="toggleActive()" class="fas fa-caret-down"></i>
          </div>

        </div>
      </div>
      <msg ref="msg" />
    </header>
  `
};
