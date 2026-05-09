/**
 * setup-admin.mjs
 * Создаёт администратора в Supabase Auth.
 * Запуск: node setup-admin.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = 'https://pnwqaokvzrdbbbukvznz.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBud3Fhb2t2enJkYmJidWt2em56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMjg0MzMsImV4cCI6MjA5MzkwNDQzM30.hQsSKmfvdhkDMyScwhHy5E2ot2viHMYvUIN2j0hLlMM';

// Логин admin пользователя
const USERNAME = 'wine_jet_apsny';
const PASSWORD = 'Абхазия**2026';
const EMAIL    = `${USERNAME}@wine-jet.admin`;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

async function main() {
  console.log(`Создаю пользователя: ${USERNAME}`);
  console.log(`Email (внутренний): ${EMAIL}`);

  const { data, error } = await supabase.auth.signUp({
    email: EMAIL,
    password: PASSWORD,
    options: {
      data: { username: USERNAME, role: 'admin' },
    },
  });

  if (error) {
    // Если уже существует — пробуем войти для проверки
    if (error.message.includes('already registered') || error.status === 422) {
      console.log('⚠️  Пользователь уже существует, проверяю вход...');
      const { error: loginErr } = await supabase.auth.signInWithPassword({ email: EMAIL, password: PASSWORD });
      if (loginErr) {
        console.error('❌ Вход не удался:', loginErr.message);
        process.exit(1);
      }
      console.log('✅ Пользователь уже существует и учётные данные верны.');
      process.exit(0);
    }
    console.error('❌ Ошибка создания:', error.message);
    process.exit(1);
  }

  if (data.user) {
    console.log('✅ Пользователь создан!');
    console.log('   ID:', data.user.id);
    console.log('   Email:', data.user.email);
    console.log('   Логин на сайте:', USERNAME);
    if (!data.session) {
      console.log('\n⚠️  Supabase отправил письмо с подтверждением.');
      console.log('   Чтобы отключить подтверждение email:');
      console.log('   Dashboard → Authentication → Settings → Disable email confirmation');
    }
  }
}

main().catch(console.error);
