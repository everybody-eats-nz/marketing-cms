import * as migration_20260609_234426_initial from './20260609_234426_initial';
import * as migration_20260611_112300_add_illustrations from './20260611_112300_add_illustrations';
import * as migration_20260615_040142_add_enquiry_form_and_corporate_email from './20260615_040142_add_enquiry_form_and_corporate_email';

export const migrations = [
  {
    up: migration_20260609_234426_initial.up,
    down: migration_20260609_234426_initial.down,
    name: '20260609_234426_initial',
  },
  {
    up: migration_20260611_112300_add_illustrations.up,
    down: migration_20260611_112300_add_illustrations.down,
    name: '20260611_112300_add_illustrations',
  },
  {
    up: migration_20260615_040142_add_enquiry_form_and_corporate_email.up,
    down: migration_20260615_040142_add_enquiry_form_and_corporate_email.down,
    name: '20260615_040142_add_enquiry_form_and_corporate_email'
  },
];
