<template>
  <div>
  <div class="card border">
    <div class="card-body">
      <p class="fs-3" @click="$router.back()">
        <i class="bi bi-arrow-left-circle cursor-pointer"></i>
      </p>

      <div class="row">
        <div class="col-md-3 mt-3">
          <ProfileImage :key="orbisImage" v-if="uAddress" class="img-fluid img-thumbnail rounded-circle col-6 col-md-12" :address="uAddress" :domain="domain" :image="orbisImage" />
        </div>

        <div class="col-md-9 mt-3">
          <h3 class="mb-3">{{ domain }}</h3>

          <!-- Data -->
          <div class="mt-4 muted-text" style="font-size: 14px;">

            <p class="me-4">
              <i class="bi bi-wallet me-1"></i>
              {{ balanceEth }} {{ $config.tokenSymbol }}
            </p>

            <p class="me-4">
              <i class="bi bi-wallet me-1"></i>
              {{ balanceChatToken }} {{ $config.chatTokenSymbol }}
            </p>

            <p class="me-4">
              <i class="bi bi-box-arrow-up-right me-2"></i>
              <a :href="$config.blockExplorerBaseUrl+'/address/'+uAddress" target="_blank" style="text-decoration: none;">
                {{ shortenAddress(uAddress) }}
              </a>
            </p>
          </div>
          <!-- END Data -->

          <!-- Buttons -->
          <div class="mt-2" v-if="isCurrentUser">
            <button 
              v-if="$config.web3storageKey === ''"
              :disabled="waitingDataLoad" 
              class="btn btn-primary mt-2 me-2" data-bs-toggle="modal" data-bs-target="#changeImageModal"
            >
              <span v-if="waitingDataLoad" class="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true"></span>
              <i class="bi bi-person-circle"></i>
              Change image
            </button>

            <!-- Upload IMG button -->
            <Web3StorageImageUpload 
              v-if="$config.web3storageKey !== '' && userStore.getIsConnectedToOrbis"  
              @insertImage="insertImage"
              buttonText="Change image"
              cls="btn btn-primary me-2 mt-2 col-8 col-md-4"
              icon="bi bi-person-circle"
            />

            <button 
              :disabled="waitingSetEmail" 
              class="btn btn-primary mt-2 me-2 col-8 col-md-4" 
              data-bs-toggle="modal" data-bs-target="#setEmailModal"
            >
              <span v-if="waitingSetEmail" class="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true"></span>
              <i class="bi bi-envelope-at-fill"></i>
              Email notifications
            </button>

            <button class="btn btn-primary mt-2 me-2 col-8 col-md-3" data-bs-toggle="modal" data-bs-target="#chatSettingsModal">
              <i class="bi bi-gear-fill"></i>
              Settings
            </button>
          </div>
          <!-- END Buttons -->

        </div>
      </div>

      

      
      

      <!--
      <p class="text-break mt-3">Followers: {{ followers }}</p>
      <p class="text-break mt-3">Following: {{ following }}</p>
      -->
    </div>

    <!-- Set Email Notifications Modal -->
    <div class="modal fade" id="setEmailModal" tabindex="-1" aria-labelledby="setEmailModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="setEmailModalLabel">Set email notifications</h1>
            <button type="button" id="setEmailModalClose" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">

            <div v-if="!userStore.getIsConnectedToOrbis">
              <p>First connect to Ceramic to set email notifications:</p>

              <button class="btn btn-primary" @click="connectToOrbis">Connect to Ceramic</button>
            </div>
            
            <div class="mt-3" v-if="userStore.getIsConnectedToOrbis">
              <p>Enter your email address to receive notifications about replies on your posts.</p>
              <p>The email address will be encrypted and will not be publicly visible.</p>

              <p v-if="emailForNotificationsSet">
                Currently, the email for notifications is already set. You can change it by entering a new email address below:
              </p>

              <p v-if="!emailForNotificationsSet">
                Currently, the email for notifications is NOT yet set. You can add your email address below:
              </p>

              <input v-model="newEmail" type="email" class="form-control mt-2" placeholder="Enter email address" />

              <small v-if="newEmail && !isEmail" class="text-danger">
                Error: The entered text is not an email.
              </small>
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>

            <!-- TODO: uncomment when removing an email is enabled in the Orbis SDK -->
            <!--
            <button 
              type="button" class="btn btn-danger" 
              v-if="emailForNotificationsSet" 
              @click="setEmailNotifications(true)"
            >
              Remove email
            </button>
            -->

            <button 
              type="button" class="btn btn-primary" 
              @click="setEmailNotifications(false)" 
              :disabled="!userStore.getIsConnectedToOrbis || !isEmail"
            >
              <span v-if="waitingSetEmail" class="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true"></span>
              Submit email
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- END Set Email Notifications Modal -->

    <!-- Change Image Modal -->
    <div class="modal fade" id="changeImageModal" tabindex="-1" aria-labelledby="changeImageModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="changeImageModalLabel">Change image</h1>
            <button type="button" id="changeImageModalClose" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">

            <div v-if="!userStore.getIsConnectedToOrbis">
              <p>First connect to Ceramic to change the profile picture:</p>

              <button class="btn btn-primary" @click="connectToOrbis">Connect to Ceramic</button>
            </div>
            
            <div class="mt-3" v-if="userStore.getIsConnectedToOrbis">
              Enter the new image URL (use a square image):

              <input v-model="newImageLink" type="text" class="form-control mt-2" placeholder="Enter image link" />

              <small v-if="newImageLink && !isImage" class="text-danger">
                Error: The entered link is not an image (it does not end with .jpg, .jpeg, .png, or similar image extension).
              </small>
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="changeImage" :disabled="!userStore.getIsConnectedToOrbis || !isImage">
              <span v-if="waitingImageUpdate" class="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true"></span>
              Submit changes
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- END Change Image Modal -->

  </div>

  <div class="card border mt-3 mb-3">
    <div class="card-body">

      <!-- Tabs Navigation -->
      <ul class="nav nav-tabs nav-fill">
        <li class="nav-item">
          <button 
            class="nav-link" 
            :class="currentTab === 'posts' ? 'active' : ''" 
            @click="changeCurrentTab('posts')" 
          >Posts</button>
        </li>
        <li class="nav-item">
          <button 
            class="nav-link" 
            :class="currentTab === 'mints' ? 'active' : ''" 
            @click="changeCurrentTab('mints')" 
          >Mints</button>
        </li>
      </ul>
      <!-- END Tabs Navigation -->

      <!-- Tabs Content -->
      <div class="tab-content mt-3">

        <!-- Posts Tab -->
        <div v-if="currentTab === 'posts' && uDid">
          <ChatFeed :byDid="uDid" :hideCommentBox="true" />
        </div>

        <!-- Mints Tab -->
        <div v-if="currentTab === 'mints' && uAddress">
          <UserMintedPosts :address="uAddress" />
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { useEthers, shortenAddress } from 'vue-dapp';
import { ethers } from 'ethers';
import { useUserStore } from '~/store/user';
import { useToast } from "vue-toastification/dist/index.mjs";
import ProfileImage from "~/components/profile/ProfileImage.vue";
import Web3StorageImageUpload from "~/components/storage/Web3StorageImageUpload.vue";
import UserMintedPosts from "~/components/minted-posts/UserMintedPosts.vue";
import ResolverAbi from "~/assets/abi/ResolverAbi.json";
import resolvers from "~/assets/data/resolvers.json";
import ChatFeed from '../chat/ChatFeed.vue';

export default {
  name: "PunkProfile",
  props: ["pAddress", "pDomain"],

  data() {
    return {
      balanceChatTokenWei: 0,
      currentTab: "posts",
      domain: this.pDomain,
      emailForNotificationsSet: false,
      followers: 0,
      following: 0,
      lastActivityTimestamp: null,
      newEmail: null,
      newImageLink: null,
      orbisImage: null,
      orbisProfile: null,
      uAddress: this.pAddress,
      uBalance: 0,
      uDid: null,
      waitingDataLoad: false,
      waitingImageUpdate: false,
      waitingSetEmail: false
    }
  },

  components: {
    ChatFeed,
    ProfileImage,
    UserMintedPosts,
    Web3StorageImageUpload
  },

  mounted() {
    // get profileCurrentTab from localStorage
    this.currentTab = localStorage.getItem("profileCurrentTab");

    if (!this.currentTab) {
      this.currentTab = "posts";
    }

    // if uAddress and/or domain is not provided via props, then find it yourself
    if (!this.pAddress || !this.pDomain) {
      this.fetchAddressAndDomain();
    }

    this.checkConnectionToOrbis();
  },

  computed: {
    balanceChatToken() {
      const bal = ethers.utils.formatEther(this.balanceChatTokenWei);

      if (bal >= 0) {
        return Math.floor(Number(bal));
      } else {
        return Number(bal).toFixed(4)
      }
    },

    balanceEth() {
      const bal = ethers.utils.formatEther(this.uBalance);

      if (bal > 0) {
        return Number(bal).toFixed(2)
      } else {
        return Number(bal).toFixed(4)
      }
    },

    isCurrentUser() {
      return String(this.uAddress).toLowerCase() === String(this.address).toLowerCase();
    },

    isEmail() {
      if (this.newEmail) {
        if (
          this.newEmail.includes("@") &&
          this.newEmail.includes(".")
        ) {
          return true;
        }
      }

      return false;
    },

    isImage() {
      // check if orbisImage includes a valid image extension
      if (this.newImageLink) {
        if (
          this.newImageLink.includes(".jpg") || 
          this.newImageLink.includes(".jpeg") ||
          this.newImageLink.includes(".png") ||
          this.newImageLink.includes(".gif") ||
          this.newImageLink.includes(".webp")
        ) {
          return true;
        }
      }

      return false;
    }
  },

  methods: {
    changeCurrentTab(tab) {
      this.currentTab = tab;
      localStorage.setItem("profileCurrentTab", tab);
    },

    async changeImage() {
      if (this.userStore.getIsConnectedToOrbis) {
        this.waitingImageUpdate = true;

        if (!this.orbisProfile) {
          this.orbisProfile = {
            pfp: "",
            username: ""
          };
        }

        this.orbisProfile.pfp = this.newImageLink;

        if (!this.orbisProfile.username && this.domain) {
          this.orbisProfile.username = this.domain;
        }

        const res = await this.$orbis.updateProfile(this.orbisProfile);

        /** Check if request is successful or not */
        if (res.status !== 200) { // unsuccessful
          console.log("Error: ", res);
          this.toast(res.result, {type: "error"});
          this.waitingImageUpdate = false;
        } else { // successful
          this.orbisImage = this.newImageLink;
          this.userStore.setOrbisImage(this.newImageLink);
          sessionStorage.setItem(String(this.address).toLowerCase()+"-img", this.newImageLink);
          this.toast("Image successfully updated!", {type: "success"});
          this.waitingImageUpdate = false;
          document.getElementById('changeImageModalClose').click();
        }
      } else {
        this.toast("Please connect to chat first", {type: "error"});
      }
    },

    async checkConnectionToOrbis() {
      if (!this.userStore.getIsConnectedToOrbis) {
        let res = await this.$orbis.isConnected();

        if (res) {
          this.userStore.setIsConnectedToOrbis(true);

          if (this.$orbis.session && !this.userStore.getDid) {
            this.userStore.setDid(this.$orbis.session.did._id);
            this.userStore.setDidParent(this.$orbis.session.did._parentId);
          }
        } else {
          this.userStore.setIsConnectedToOrbis(false);
        }
      }
    },

    async connectToOrbis() {
      if (!this.userStore.getIsConnectedToOrbis) {
        let res = await this.$orbis.connect_v2({
          provider: this.signer.provider.provider, 
          lit: false
        });

        /** Check if connection is successful or not */
        if(res.status == 200) {
          this.userStore.setIsConnectedToOrbis(true);

          if (this.$orbis.session) {
            this.userStore.setDid(this.$orbis.session.did._id);
            this.userStore.setDidParent(this.$orbis.session.did._parentId);
          }
        } else {
          console.log("Error connecting to Ceramic: ", res);
          this.toast(res.result, {type: "error"});
        }
      }
    },

    async fetchAddressAndDomain() {
      this.waitingDataLoad = true;

      // see if id is in the URL query and figure out whether it is a domain or uAddress
      if (this.$route.query.id) {
        const id = this.$route.query.id;

        if (id.includes(".")) {
          this.domain = id; // domain
        } else {
          this.uAddress = id; // address
        }
      } else {
        // if no id is provided, then use the user's address
        this.uAddress = this.address;
      }

      // if domain is not provided, check session storage
      if (!this.domain && this.uAddress) {
        this.domain = window.sessionStorage.getItem(String(this.uAddress).toLowerCase());
      }

      // set contract
      let provider = this.$getFallbackProvider(this.$config.supportedChainId);

      if (this.isActivated && this.chainId === this.$config.supportedChainId) {
        // fetch provider from user's wallet
        provider = this.signer;
      }

      const contract = new ethers.Contract(resolvers[this.$config.supportedChainId], ResolverAbi, provider);

      // if domain is not provided, then fetch it
      if (!this.domain && this.uAddress) {
        const domainName = await contract.getDefaultDomain(
          String(this.uAddress).toLowerCase(), 
          String(this.$config.tldName).toLowerCase()
        );

        if (domainName) {
          this.domain = domainName + this.$config.tldName;
          window.sessionStorage.setItem(String(this.uAddress).toLowerCase(), this.domain);
        } 
      }

      if (this.domain && !this.uAddress) {
        const domainHolder = await contract.getDomainHolder(
          String(this.domain).toLowerCase().split(".")[0], 
          String(this.$config.tldName).toLowerCase()
        );

        if (domainHolder !== ethers.constants.AddressZero) {
          this.uAddress = domainHolder;
        }

        window.sessionStorage.setItem(String(this.uAddress).toLowerCase(), this.domain);
      }

      await this.fetchOrbisProfile();
      await this.fetchBalance();
    },

    async fetchBalance() {
      if (this.uAddress) {
        let provider = this.$getFallbackProvider(this.$config.supportedChainId);

        /*
        if (this.isActivated && this.chainId === this.$config.supportedChainId) {
          // fetch provider from user's wallet
          provider = this.signer.provider.provider;
        }
        */

        // fetch balance of an address
        this.uBalance = await provider.getBalance(this.uAddress);

        if (this.$config.chatTokenAddress) {
          // fetch chat balance
          const chatInterface = new ethers.utils.Interface([
            "function balanceOf(address owner) view returns (uint256)"
          ]);
          
          const chatContract = new ethers.Contract(this.$config.chatTokenAddress, chatInterface, provider);

          this.balanceChatTokenWei = await chatContract.balanceOf(this.uAddress);
        }
      }
    },

    async fetchOrbisProfile() {
      this.orbisProfile = {
        pfp: "",
        username: ""
      };

      if (this.uAddress) {
        let { data, error } = await this.$orbis.getDids(this.uAddress);

        if (data[0]?.did) {
          this.uDid = data[0].did;

          const profile = await this.$orbis.getProfile(data[0].did);

          if (profile.status === 200) {
            this.orbisProfile = profile.data.details.profile;
    
            if (profile && profile.data.details.profile && profile.data.details.profile.pfp) {
              this.orbisImage = profile.data.details.profile.pfp;
            }

            if (profile) {
              this.followers = profile.data.count_followers;
              this.following = profile.data.count_following;
              this.lastActivityTimestamp = profile.data.last_activity_timestamp;
            }

            if (profile.data.details["encrypted_email"]) {
              this.emailForNotificationsSet = true;
            } else {
              this.emailForNotificationsSet = false;
            }

            this.waitingDataLoad = false;
          }
        }

        this.waitingDataLoad = false;
      }
    },

    async insertImage(imageUrl) {
      // get image from Web3StorageImageUpload component and call the changeImage function
      this.newImageLink = imageUrl;
      this.changeImage();
    },

    async setEmailNotifications(remove) {
      if (this.userStore.getIsConnectedToOrbis) {
        this.waitingSetEmail = true;

        if (remove) {
          this.newEmail = "";
        }

        let res = await this.$orbis.setEmail(this.newEmail);

        if (res.status !== 200) { // unsuccessful
          console.log("Error: ", res);
          this.toast(res.result, {type: "error"});
          this.waitingSetEmail = false;
        } else { // successful
          this.toast("Email notifications successfully set!", {type: "success"});
          this.waitingSetEmail = false;
          document.getElementById('setEmailModalClose').click();
        }
      } else {
        this.toast("Please connect to chat first", {type: "error"});
      }
    }
  },

  setup() {
    const { address, balance, chainId, isActivated, signer } = useEthers();
    const userStore = useUserStore();
    const toast = useToast();

    return { address, balance, chainId, isActivated, userStore, shortenAddress, signer, toast };
  },

  watch: {
    address() {
      this.fetchAddressAndDomain();
    }
  }
}
</script>
