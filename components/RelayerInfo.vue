<template>
  <work-area>
    <div :class="$style.row">
      <base-input
        :class="$style.input"
        readonly
        type="url"
        :label="$t('components.relayerInfo.inputs.labels.first')"
        :model-value="relayerUrl"
        :loading="isLoading"
      />
    </div>
    <div :class="$style.row">
      <base-input
        readonly
        type="text"
        :label="$t('components.relayerInfo.inputs.labels.second')"
        :model-value="ensName"
        :loading="isLoading"
      />

      <content-placeholders v-if="isLoading" :rounded="true" animated :class="$style.placeholder">
        <content-placeholders-img />
      </content-placeholders>

      <div v-else :class="$style.subdomains">
        <li v-for="subdomain in subdomains" :key="subdomain.name" :class="$style.subdomains__item">
          <span :class="$style.subdomains__itemIcon"><base-icon size="fill" :name="subdomain.icon" /></span>
          <span :class="$style.subdomains__itemStatus"><base-icon size="fill" :name="subdomain.status" /></span>
        </li>
      </div>
    </div>
    <div :class="$style.row">
      <label for="workerAddress" :class="$style.label"> {{ $t('components.relayerInfo.content.first') }}</label>

      <content-placeholders v-if="isLoading" :class="$style.placeholder" :rounded="true" animated>
        <content-placeholders-text :lines="3" />
      </content-placeholders>

      <worker-address
        v-for="(worker, index) of workers"
        v-else
        id="workerAddress"
        :key="worker + index"
        :index="index"
        :worker-address="worker"
        without-btns
      />
    </div>
    <slot v-if="editableStake" id="#editableStake" />
    <base-input
      v-else
      icon="torn"
      readonly
      ticker="torn"
      input-mode="numeric"
      :label="$t(stakeText)"
      :model-value="String(stake)"
      :loading="isLoading"
    />
  </work-area>
</template>
<script>
import { WorkArea } from '@/containers'
import WorkerAddress from '@/components/workers/WorkerAddress.vue'

export default {
  components: { WorkerAddress, WorkArea },
  props: {
    relayerUrl: {
      type: String,
      required: true,
    },
    ensName: {
      type: String,
      required: true,
    },
    subdomains: {
      type: Array,
      default: () => [],
    },
    workers: {
      type: Array,
      default: () => [],
    },
    stake: {
      type: String,
      required: true,
    },
    stakeText: {
      type: String,
      default: () => 'components.relayerInfo.inputs.labels.third',
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    editableStake: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" module>
.label {
  margin: 0 0 0.8rem;
  padding: 0;
  display: inline-block;
  font-weight: $font-weight-regular;
  font-size: 1.4rem;
  line-height: 1.2;
  color: $color-white;
  background-color: $color-transparent;
}

.row {
  margin-bottom: 1rem;
}

.workers {
  display: flex;
  &__title {
    margin-right: 0.5rem;
  }
}

.subdomains {
  margin: 1.5rem 0 0;
  padding: 0;
  font-size: 1.3rem;
  font-weight: 400;
  display: grid;
  width: 100%;
  columns: 4;
  grid-template-columns: repeat(4, calc(25% - 1.3rem));
  column-gap: 1.6rem;
  row-gap: 1.2rem;

  &__item {
    display: flex;
    justify-content: space-around;
    list-style: none;
    background-color: $color-dark;
    padding: 0.5rem 0.8rem;
    border-radius: 0.4rem;
    align-items: center;

    &Icon {
      width: 2rem;
      height: 2rem;
      margin-right: 1rem;
    }

    &Status {
      width: 1.5rem;
      height: auto;
    }
  }

  .success {
    color: $color-success;
  }

  .failed {
    color: $color-warning;
  }

  .missing {
    color: $color-link-text;
  }
}

.placeholder {
  width: 100%;
  margin: 1.5rem 0;
}
// ToDo refactor
.successIcon {
  padding: 0.2rem 0 !important;
}
// ToDo refactor
.subdomainIcon {
  padding: 0.2rem 0 !important;
}
</style>
<style lang="scss">
.vue-content-placeholders-text__line,
.vue-content-placeholders-img {
  background: $color-dark !important;
  &::before {
    width: 20%;
    background: linear-gradient(to right, transparent 0%, $color-bg-primary 15%, transparent 30%) !important;
  }
}
</style>
