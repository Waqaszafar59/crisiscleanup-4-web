import { useI18n } from 'vue-i18n';
import { snakeToTitleCase } from '../../filters';
import Filter from './Filter';

export default class WorksiteMissingWorkTypeFilter extends Filter {
  packFunction() {
    const packed: Record<string, unknown> = {};
    if (this.data.missing_work_type) {
      packed.missing_work_type = true;
    }

    return packed;
  }

  getCount() {
    if (!this.data) {
      return 0;
    }

    const entries = Object.entries(this.data).filter(([, value]) => {
      return Boolean(value);
    });
    return entries.length;
  }

  getFilterLabels() {
    const labels: Record<string, unknown> = {};
    for (const [key] of Object.entries(this.data).filter(([, value]) => {
      return Boolean(value);
    })) {
      labels[key] = `${useI18n().t(
        'worksiteFilters.status',
      )}: ${snakeToTitleCase(key)}`;
    }

    return labels;
  }

  removeField(identifier: string) {
    this.data[identifier] = false;
    this.data = { ...this.data };
  }
}
