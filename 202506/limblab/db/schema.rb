# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2024_03_05_125447) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "admins", force: :cascade do |t|
    t.string "email", null: false
    t.string "password_digest", limit: 60, null: false
    t.string "first_name"
    t.string "last_name"
    t.boolean "active", default: true, null: false
    t.string "password_reset_token"
    t.datetime "password_reset_requested_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["email"], name: "index_admins_on_email", unique: true
  end

  create_table "clients", force: :cascade do |t|
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "first_name"
    t.string "last_name"
    t.boolean "active", default: true, null: false
    t.uuid "api_token", default: -> { "gen_random_uuid()" }, null: false
    t.string "password_reset_token"
    t.datetime "password_reset_requested_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "phone"
    t.index ["api_token"], name: "index_clients_on_api_token", unique: true
    t.index ["email"], name: "index_clients_on_email", unique: true
  end

  create_table "clinicians", force: :cascade do |t|
    t.string "email", null: false
    t.string "password_digest", limit: 60, null: false
    t.string "first_name"
    t.string "last_name"
    t.boolean "active", default: true, null: false
    t.uuid "api_token", default: -> { "gen_random_uuid()" }, null: false
    t.string "code", null: false
    t.string "password_reset_token"
    t.datetime "password_reset_requested_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "title"
    t.index ["api_token"], name: "index_clinicians_on_api_token", unique: true
    t.index ["code"], name: "index_clinicians_on_code", unique: true
    t.index ["email"], name: "index_clinicians_on_email", unique: true
  end

  create_table "conversations", force: :cascade do |t|
    t.bigint "client_id", null: false
    t.boolean "archived", default: false, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "api_token", null: false
    t.index ["api_token"], name: "index_conversations_on_api_token", unique: true
    t.index ["client_id"], name: "index_conversations_on_client_id"
  end

  create_table "daily_message_counters", force: :cascade do |t|
    t.datetime "day"
    t.bigint "clinician_id", null: false
    t.integer "count"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["clinician_id"], name: "index_daily_message_counters_on_clinician_id"
  end

  create_table "devices", force: :cascade do |t|
    t.bigint "client_id"
    t.bigint "clinician_id"
    t.boolean "active", default: true, null: false
    t.string "platform", null: false
    t.string "token", null: false
    t.string "arn"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["client_id"], name: "index_devices_on_client_id"
    t.index ["clinician_id"], name: "index_devices_on_clinician_id"
  end

  create_table "locations", force: :cascade do |t|
    t.string "name", null: false
    t.string "address_line1"
    t.string "address_line2"
    t.string "city"
    t.string "state"
    t.string "postal"
    t.string "phone"
    t.string "fax"
    t.string "mobile"
    t.float "lat"
    t.float "lng"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "manager_email"
  end

  create_table "messages", force: :cascade do |t|
    t.bigint "conversation_id", null: false
    t.integer "urgency", default: 0, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "api_token", null: false
    t.bigint "clinician_id"
    t.index ["api_token"], name: "index_messages_on_api_token", unique: true
    t.index ["conversation_id"], name: "index_messages_on_conversation_id"
  end

  create_table "notifications", force: :cascade do |t|
    t.integer "status", default: 0, null: false
    t.string "body", null: false
    t.json "payload"
    t.integer "device_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "practices", force: :cascade do |t|
    t.bigint "clinician_id", null: false
    t.bigint "location_id", null: false
    t.boolean "primary", default: false, null: false
    t.boolean "active", default: true, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["clinician_id"], name: "index_practices_on_clinician_id"
    t.index ["location_id"], name: "index_practices_on_location_id"
  end

  create_table "que_jobs", comment: "7", force: :cascade do |t|
    t.integer "priority", limit: 2, default: 100, null: false
    t.datetime "run_at", default: -> { "now()" }, null: false
    t.text "job_class", null: false
    t.integer "error_count", default: 0, null: false
    t.text "last_error_message"
    t.text "queue", default: "default", null: false
    t.text "last_error_backtrace"
    t.datetime "finished_at"
    t.datetime "expired_at"
    t.jsonb "args", default: [], null: false
    t.jsonb "data", default: {}, null: false
    t.integer "job_schema_version", null: false
    t.jsonb "kwargs", default: {}, null: false
    t.index ["args"], name: "que_jobs_args_gin_idx", opclass: :jsonb_path_ops, using: :gin
    t.index ["data"], name: "que_jobs_data_gin_idx", opclass: :jsonb_path_ops, using: :gin
    t.index ["job_class"], name: "que_scheduler_job_in_que_jobs_unique_index", unique: true, where: "(job_class = 'Que::Scheduler::SchedulerJob'::text)"
    t.index ["job_schema_version", "queue", "priority", "run_at", "id"], name: "que_poll_idx", where: "((finished_at IS NULL) AND (expired_at IS NULL))"
    t.index ["kwargs"], name: "que_jobs_kwargs_gin_idx", opclass: :jsonb_path_ops, using: :gin
    t.check_constraint "(char_length(last_error_message) <= 500) AND (char_length(last_error_backtrace) <= 10000)", name: "error_length"
    t.check_constraint "(jsonb_typeof(data) = 'object'::text) AND ((NOT (data ? 'tags'::text)) OR ((jsonb_typeof((data -> 'tags'::text)) = 'array'::text) AND (jsonb_array_length((data -> 'tags'::text)) <= 5) AND que_validate_tags((data -> 'tags'::text))))", name: "valid_data"
    t.check_constraint "char_length(queue) <= 100", name: "queue_length"
    t.check_constraint "jsonb_typeof(args) = 'array'::text", name: "valid_args"
    t.check_constraint nil, name: "job_class_length"
  end

  create_table "que_lockers", primary_key: "pid", id: :integer, default: nil, force: :cascade do |t|
    t.integer "worker_count", null: false
    t.integer "worker_priorities", null: false, array: true
    t.integer "ruby_pid", null: false
    t.text "ruby_hostname", null: false
    t.text "queues", null: false, array: true
    t.boolean "listening", null: false
    t.integer "job_schema_version", default: 1
    t.check_constraint "(array_ndims(queues) = 1) AND (array_length(queues, 1) IS NOT NULL)", name: "valid_queues"
    t.check_constraint "(array_ndims(worker_priorities) = 1) AND (array_length(worker_priorities, 1) IS NOT NULL)", name: "valid_worker_priorities"
  end

  create_table "que_scheduler_audit", primary_key: "scheduler_job_id", id: :bigint, default: nil, comment: "7", force: :cascade do |t|
    t.datetime "executed_at", null: false
  end

  create_table "que_scheduler_audit_enqueued", id: false, force: :cascade do |t|
    t.bigint "scheduler_job_id", null: false
    t.string "job_class", limit: 255, null: false
    t.string "queue", limit: 255
    t.integer "priority"
    t.jsonb "args", null: false
    t.bigint "job_id"
    t.datetime "run_at"
    t.index ["args"], name: "que_scheduler_audit_enqueued_args"
    t.index ["job_class"], name: "que_scheduler_audit_enqueued_job_class"
    t.index ["job_id"], name: "que_scheduler_audit_enqueued_job_id"
  end

  create_table "que_values", primary_key: "key", id: :text, force: :cascade do |t|
    t.jsonb "value", default: {}, null: false
    t.check_constraint "jsonb_typeof(value) = 'object'::text", name: "valid_value"
  end

  create_table "relationships", force: :cascade do |t|
    t.bigint "client_id", null: false
    t.bigint "clinician_id", null: false
    t.boolean "primary", default: false, null: false
    t.boolean "active", default: true, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "notes"
    t.index ["client_id"], name: "index_relationships_on_client_id"
    t.index ["clinician_id"], name: "index_relationships_on_clinician_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "conversations", "clients"
  add_foreign_key "daily_message_counters", "clinicians"
  add_foreign_key "devices", "clients"
  add_foreign_key "devices", "clinicians"
  add_foreign_key "messages", "clinicians"
  add_foreign_key "messages", "conversations"
  add_foreign_key "notifications", "devices"
  add_foreign_key "practices", "clinicians"
  add_foreign_key "practices", "locations"
  add_foreign_key "que_scheduler_audit_enqueued", "que_scheduler_audit", column: "scheduler_job_id", primary_key: "scheduler_job_id", name: "que_scheduler_audit_enqueued_scheduler_job_id_fkey"
  add_foreign_key "relationships", "clients"
  add_foreign_key "relationships", "clinicians"
end
