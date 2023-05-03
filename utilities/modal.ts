import { Component } from 'vue'

import { ModalProps } from '@/types'

const modalSizes = {
  MIN: 380,
  BIG: 760,
}

const MAX_WIDTHS: { [key in string]: number } = {
  StakeModal: modalSizes.MIN,
  AccountModal: modalSizes.BIG,
}

const createModalArgs = (component: Component, componentProps = {}, modalProps: ModalProps = {}) => {
  if (!component.name) {
    throw new Error('Pulling component must have NAME property')
  }

  if (MAX_WIDTHS[component.name]) {
    modalProps.width = MAX_WIDTHS[component.name]
  }

  return [component, { modalName: component.name, ...componentProps }, { name: component.name, ...modalProps }]
}

export { createModalArgs }
