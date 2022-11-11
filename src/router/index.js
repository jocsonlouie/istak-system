import Vue from 'vue'
import VueRouter from 'vue-router'
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { getDocs, collection, query } from "@firebase/firestore";
import db from "@/fb";
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/pages/Login.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/pages/Register.vue'),
    meta: {
      layout: 'blank',
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: {
      requiresAuth: true,
     
    },
    component: () => import('@/views/dashboard/Dashboard.vue'),

  },
  {
    path: '/typography',
    name: 'typography',
    component: () => import('@/views/typography/Typography.vue'),
  },
  {
    path: '/icons',
    name: 'icons',
    component: () => import('@/views/icons/Icons.vue'),
  },
  {
    path: '/cards',
    name: 'cards',
    component: () => import('@/views/cards/Card.vue'),
  },
  {
    path: '/simple-table',
    name: 'simple-table',
    component: () => import('@/views/simple-table/SimpleTable.vue'),
  },
  {
    path: '/form-layouts',
    name: 'form-layouts',
    component: () => import('@/views/form-layouts/FormLayouts.vue'),
  },
  {
    path: '/inventory-list',
    name: 'InventoryList',
    component: () => import('@/views/SampleInventory.vue'),
  },
  {
    path: '/custom-inventory',
    name: 'CustomInventory',
    component: () => import('@/views/CustomInventoryView.vue'),
  },
  {
    path: '/supplier-list',
    name: 'SupplierList',
    component: () => import('@/views/SupplierView.vue'),
  },
  {
    path: '/barcode-management',
    name: 'barcode-management',
    component: () => import('@/views/BarcodesView.vue'),
  },
  {
    path: '/account-settings',
    name: 'account-settings',
    component: () => import('@/views/pages/account-settings/AccountSettings.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/user-roles',
    name: 'user-roles',
    component: () => import('@/views/UserRolesView.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: '/pages/login',
    name: 'pages-login',
    component: () => import('@/views/pages/Login.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/error-404',
    name: 'error-404',
    component: () => import('@/views/Error.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '*',
    name: 'catchAll',
    redirect: 'error-404',
  },
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(getAuth(), (user) => {
      removeListener();
      resolve(user);
    }, reject)
  });
}
// router.beforeEach(async (to, from, next) => {
//   if (to.matched.some((record) => record.meta.requiresAuth)) {
//     if (await getCurrentUser()) {
//       next();
//     } else {
//       alert("No Access!");
//       next("/");
//     }
//   } else {
//     next();
//   }
// });

let auth;
router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
      if (user) {
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          if (user.uid === doc.id) {
            //console.log(doc.data().role)
            if(doc.data().role == "Can't Access"){
              alert("Registered but No Access");
              next("/");
            }else{
              //alert("No Access!");
              next();
            }
          }
        });
      }
    });
      // next();
    } else {
      alert("No Access!");
      next("/");
    }
  } else {
    next();
  }
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAdmin)) {
   
    if (await getCurrentUser()) {
     auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
      if (user) {
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          if (user.uid === doc.id) {
            //console.log(doc.data().role)
            if(doc.data().role == 'Inventory Admin'){
              next();
            }else{
              //alert("No Access!");
              next("/");
            }
          }
        });
      }
    });
      
    } else {
      alert("No Access!");
      next("/");
    }
  } else {
    next();
  }
});


export default router
