<template>
  <div>
    <div :class="$style.header">
      <h6 v-for="header of headers" :key="header.text" :class="$style.header__item">
        {{ $t(header.text) }}
        <base-icon v-if="header.tooltip" name="info" :tooltip="header.tooltip" />
      </h6>
    </div>

    <div v-if="txsHistory.length">
      <div v-for="tx of txsList" :key="tx.transactionHash" :class="$style.tx__row">
        <base-explorer-link
          type="transaction"
          :class="$style.tx__hash"
          :value="tx.transactionHash"
          :chain-id="String(tx.chainId)"
        >
          {{ tx.renderTxHash }}
        </base-explorer-link>
        <div v-if="tx.timestamp" :class="$style.tx__timeStamp">
          <span :class="$style.tx__date">{{ tx.timestamp.date }}</span>
          <span :class="$style.tx__time">{{ tx.timestamp.time }}</span>
        </div>
        <div v-else>—</div>
        <div v-if="tx.type">
          {{ tx.type }}
        </div>
        <div v-else>—</div>
        <div v-if="tx.status" :class="$style.tx__status">
          {{ tx.status }}
        </div>
        <div v-else>—</div>
      </div>
    </div>

    <div v-else :class="$style.tx__noTransactions">
      <h5 :class="$style.tx__noTransactionsText">No data</h5>
    </div>

    <div :class="$style.pagination">
      <base-pagination :list="txsHistory" :current="current" :limit="limit" @on-set-list="onSetList" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { DateTime } from 'luxon'
import { BigNumber } from 'ethers'

import { txStatuses } from '@/constants'
import { sliceHash, hashRender } from '@/utilities'

export default {
  data: function () {
    return {
      limit: 5,
      current: 1,
      txsList: [],
      headers: [
        { text: 'modals.account.table.columns.first', tooltip: '' },
        { text: 'modals.account.table.columns.second', tooltip: '' },
        { text: 'modals.account.table.columns.third', tooltip: '' },
        { text: 'modals.account.table.columns.fourth', tooltip: '' },
      ],
    }
  },
  computed: {
    ...mapGetters('wallet', ['chainConfig']),
    ...mapGetters('transaction', ['txsHistory']),
    transactions() {
      return this.txsHistory.map(({ transactionHash, status, timestamp, chainId, txType }) => {
        const txTimestamp = this.getTime(timestamp)
        const txStatus = Object.keys(txStatuses).find((key) => BigNumber.from(txStatuses[key]).eq(status))

        return {
          chainId,
          type: txType,
          transactionHash,
          timestamp: txTimestamp,
          status: txStatus.toLowerCase(),
          renderTxHash: hashRender(transactionHash),
        }
      })
    },
  },
  methods: {
    getTime(dataTime) {
      const millis = DateTime.fromMillis(Number(dataTime))
      const date = millis.toLocaleString(DateTime.DATE_SHORT)
      const time = millis.toLocaleString(DateTime.TIME_WITH_SECONDS)

      if (date.includes('Invalid DateTime') || time.includes('Invalid DateTime')) {
        return
      }
      return { date, time }
    },
    onSetList({ from, to }) {
      const array = [...this.transactions]
      this.txsList = array.splice(from, to)
    },
    sliceHash,
  },
}
</script>

<style lang="scss" module>
.header {
  margin: 0 0 1rem;
  padding: 0 2rem;
  width: 100%;
  display: inline-grid;
  grid-template-columns: 20% 20% 20% 20%;
  grid-template-rows: auto;
  justify-content: space-between;
  align-items: center;
  grid-gap: 0 1.6rem;
  &__item {
    margin: 0;
    font-weight: $font-weight-bold;
    font-size: 1.2rem;
    line-height: 1.2;
    color: $color-white;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    &:first-child {
      width: 5rem;
      word-break: keep-all;
    }
  }
}

.tx {
  &__row {
    margin: 0 0 0.2rem;
    padding: 0.8rem 1.6rem;
    width: 100%;
    display: inline-grid;
    grid-template-columns: 20% 20% 20% 20%;
    grid-template-rows: auto;
    justify-content: space-between;
    align-items: center;
    grid-gap: 0 1.6rem;
    background-color: $color-white-003;
    border-radius: 0.4rem;
    &:last-child {
      margin: 0 0 2.4rem;
    }
    @include media('sm') {
      padding: 1.2rem 2rem;
    }
  }
  &__status {
    width: 7rem;
    height: 3rem;
  }
  &__timeStamp {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-weight: $font-weight-regular;
  }
  &__date {
    font-size: 1.4rem;
    line-height: 1.4;
  }
  &__time {
    font-size: 1.2rem;
    line-height: 1;
  }
  &__amount {
    font-weight: $font-weight-bold;
    font-size: 1.4rem;
    line-height: 1;
  }
  &__type {
    max-width: 9rem;
    font-weight: $font-weight-regular;
    font-size: 1.4rem;
    line-height: 1.2;
    &:first-letter {
      text-transform: uppercase;
    }
  }
  &__recipient {
    font-weight: $font-weight-regular;
    font-size: 1.4rem;
    line-height: 1;
    color: $color-grey;
    text-decoration: underline;
    &:hover {
      color: $color-default;
    }
  }
  &__noTransactions {
    text-align: center;
  }
  &__noTransactionsText {
    margin: 0;
    padding: 1.2rem;
    font-weight: $font-weight-regular;
    font-size: 1.4rem;
    line-height: 1.2;
    color: $color-white;
    background-color: $color-white-01;
    border-radius: 0.6rem;
  }
}

.pagination {
  top: -0.7rem;
  position: relative;
}
</style>
