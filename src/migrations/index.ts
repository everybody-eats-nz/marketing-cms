import * as migration_20260609_234426_initial from './20260609_234426_initial';
import * as migration_20260611_112300_add_illustrations from './20260611_112300_add_illustrations';
import * as migration_20260615_040142_add_enquiry_form_and_corporate_email from './20260615_040142_add_enquiry_form_and_corporate_email';
import * as migration_20260616_031659_add_documents_and_downloads from './20260616_031659_add_documents_and_downloads';
import * as migration_20260616_055922_add_stat_live_metric_and_suffix from './20260616_055922_add_stat_live_metric_and_suffix';
import * as migration_20260616_211500_remove_daily_menus from './20260616_211500_remove_daily_menus';
import * as migration_20260617_014949_add_user_email_verification from './20260617_014949_add_user_email_verification';
import * as migration_20260617_081858_add_donations_and_feedback from './20260617_081858_add_donations_and_feedback';
import * as migration_20260618_050316_add_pay_settings from './20260618_050316_add_pay_settings';

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
    name: '20260615_040142_add_enquiry_form_and_corporate_email',
  },
  {
    up: migration_20260616_031659_add_documents_and_downloads.up,
    down: migration_20260616_031659_add_documents_and_downloads.down,
    name: '20260616_031659_add_documents_and_downloads',
  },
  {
    up: migration_20260616_055922_add_stat_live_metric_and_suffix.up,
    down: migration_20260616_055922_add_stat_live_metric_and_suffix.down,
    name: '20260616_055922_add_stat_live_metric_and_suffix',
  },
  {
    up: migration_20260616_211500_remove_daily_menus.up,
    down: migration_20260616_211500_remove_daily_menus.down,
    name: '20260616_211500_remove_daily_menus',
  },
  {
    up: migration_20260617_014949_add_user_email_verification.up,
    down: migration_20260617_014949_add_user_email_verification.down,
    name: '20260617_014949_add_user_email_verification',
  },
  {
    up: migration_20260617_081858_add_donations_and_feedback.up,
    down: migration_20260617_081858_add_donations_and_feedback.down,
    name: '20260617_081858_add_donations_and_feedback',
  },
  {
    up: migration_20260618_050316_add_pay_settings.up,
    down: migration_20260618_050316_add_pay_settings.down,
    name: '20260618_050316_add_pay_settings'
  },
];
