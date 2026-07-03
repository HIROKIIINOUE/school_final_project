# Database design

Users {　
Id: uuid,
user_name: string,
email: string(unique),
avatar_url: string,
created_at: date,
updated_at: date,
}

Trips {
id: uuid,
created_by: Users.id
invite_url: string(unique),
title: string,
description: string,
start_date: date,
end_date: date,
is_reminder: boolean (default false)
reminder_at: timestamp (nullable)
created_at: date,
updated_at: date,
}

Trip_members {
id: uuid,
trip_id: Trips.id,
user_id: Users.id,
role: string, // owner, member
joined_at: date,
created_at: date,
updated_at: date
}

Itinerary_items {
id: uuid,
trip_id: Trips.id,
created_by: Users.id,
title: string,
detail: string,
detail_file: string,
time: TIMESTAMP,
created_at: date,
updated_at: date,
}

Messages {
id: uuid,
user_id: Users.id,
trip_id: Trips.id,
content: text,
created_at: date,
updated_at: date,
}

Expenses {
id: uuid,
trip_id: Trips.id,
title: string,
note: string (nullable),
amount: decimal,
currency: string,
date: Date (default now),
payer_id: Users.id,
created_at: date,
updated_at: date,
}

expense_splits {
id: uuid,
expense_id: Expenses.id,
user_id: Users.id (unique),
amount_owed: decimal,
created_at: date,
updated_at: date,
}
