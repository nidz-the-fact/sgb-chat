import { defineStore } from 'pinia';
import { ethers } from 'ethers';

export const useUserStore = defineStore({
  id: 'user',

  state: () => {
    return {
      chatTokenBalanceWei: BigInt(0),
      defaultDomain: null,
      did: null,
      didParent: null,
      followers: 0,
      following: 0,
      isConnectedToOrbis: false,
      lastActivityTimestamp: null,
      orbisImage: null
    }
  },

  getters: {
    getChatTokenBalance(state) {
      const balance = ethers.utils.formatEther(state.chatTokenBalanceWei);

      const formatter = Intl.NumberFormat('en', { notation: 'compact' });

      return formatter.format(Number(balance));
    },

    getChatTokenBalanceWei(state) {
      return state.chatTokenBalanceWei;
    },

    getDefaultDomain(state) {
      return state.defaultDomain;
    },

    getDid(state) {
      return state.did;
    },

    getDidParent(state) {
      return state.didParent;
    },

    getFollowers(state) {
      return state.followers;
    },

    getFollowing(state) {
      return state.following;
    },

    getIsConnectedToOrbis(state) {
      return state.isConnectedToOrbis;
    },

    getLastActivityTimestamp(state) {
      return state.lastActivityTimestamp;
    },

    getOrbisImage(state) {
      return state.orbisImage;
    }
  },

  actions: {
    addToChatTokenBalanceWei(balance: ethers.BigNumber) {
      this.chatTokenBalanceWei += balance.toBigInt();
    },

    setChatTokenBalanceWei(balance: ethers.BigNumber) {
      this.chatTokenBalanceWei = balance.toBigInt();
    },

    setDefaultDomain(domain: any) {
      this.defaultDomain = domain;
    },

    setDid(did: any) {
      this.did = did;
    },

    setDidParent(didParent: any) {
      this.didParent = didParent;
    },

    setFollowers(followers: any) {
      this.followers = followers;
    },

    setFollowing(following: any) {
      this.following = following;
    },

    setIsConnectedToOrbis(isConnected: any) {
      this.isConnectedToOrbis = isConnected;
    },

    setLastActivityTimestamp(timestamp: any) {
      this.lastActivityTimestamp = timestamp;
    },

    setOrbisImage(image: any) {
      this.orbisImage = image;
    }
  }
})