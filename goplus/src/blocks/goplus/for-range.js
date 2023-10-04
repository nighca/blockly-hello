import * as Blockly from 'blockly';
import { plusImage, minusImage } from './helpers';

const mutator = {
  saveExtraState() {
    return {
      'hasValue': this.hasValue_,
    };
  },
  loadExtraState(state) {
    this.updateWith_(state['hasValue']);
  },
}

Blockly.Extensions.registerMutator('goplus-for-range-mutator', mutator);

export default {

  hasValue_: false,

  mutator: 'goplus-for-range-mutator',

  /**
   * @this Blockly.Block
   */
  init() {
    this.setTooltip('`for...range` for goplus.');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendDummyInput('INPUT_VAR');
    this.appendValueInput('LIST')
        .appendField('range');
    this.appendStatementInput('DO')
        .appendField('do');
    this.appendDummyInput()
        .appendField('end');

    this.setInputsInline(true);
    this.updateWith_(false);
    Blockly.Extensions.apply('goplus-for-range-mutator', this, true);
  },

  /**
   * Update shape
   * @this Blockly.Block
   * @param {boolean} hasValue 
   */
  updateWith_(hasValue) {

    this.hasValue_ = hasValue

    const inputVar = this.getInput('INPUT_VAR')
    if (!this.getField('FOR')) { // init
      inputVar?.appendField('for', 'FOR')
      inputVar?.appendField(new Blockly.FieldVariable('k'), 'VAR_KEY')
    }

    if (hasValue) {
      if (this.getField('PLUS')) inputVar?.removeField('PLUS')
      if (!this.getField('COMMA')) inputVar?.appendField(',', 'COMMA')
      if (!this.getField('VAR_VALUE')) inputVar?.appendField(new Blockly.FieldVariable('v'), 'VAR_VALUE')
      if (!this.getField('MINUS')) inputVar?.appendField(new Blockly.FieldImage(minusImage, 15, 15, undefined, this.onMinusClick_), 'MINUS')
    } else {
      if (this.getField('COMMA')) inputVar?.removeField('COMMA')
      if (this.getField('VAR_VALUE')) inputVar?.removeField('VAR_VALUE')
      if (this.getField('MINUS')) inputVar?.removeField('MINUS')
      if (!this.getField('PLUS')) inputVar?.appendField(new Blockly.FieldImage(plusImage, 15, 15, undefined, this.onPlusClick_), 'PLUS')
    }
  },

  /**
   * @param {Blockly.FieldImage} minusField
   */
  onMinusClick_(minusField) {
    const block = minusField.getSourceBlock();
    if (block.isInFlyout) return;

    Blockly.Events.setGroup(true);
    const oldExtraState = block.saveExtraState();
    block.updateWith_(false);
    const newExtraState = block.saveExtraState();
    Blockly.Events.fire(new Blockly.Events.BlockChange(block, 'mutation', null, oldExtraState, newExtraState));
    Blockly.Events.setGroup(false);
  },

  /**
   * @param {Blockly.FieldImage} minusField
   */
  onPlusClick_(minusField) {
    const block = minusField.getSourceBlock();
    if (block.isInFlyout) return;

    Blockly.Events.setGroup(true);
    const oldExtraState = block.saveExtraState();
    block.updateWith_(true);
    const newExtraState = block.saveExtraState();
    Blockly.Events.fire(new Blockly.Events.BlockChange(block, 'mutation', null, oldExtraState, newExtraState));
    Blockly.Events.setGroup(false);
  }
};
