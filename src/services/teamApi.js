const BASE_URL =
  import.meta.env.VITE_API_URL || "https://accelia-backend.onrender.com";

const API = `${BASE_URL}/api/team`;
export async function fetchPublicTeam() {
  const res = await fetch(`${API}`);
  if (!res.ok) throw new Error("Failed to fetch team");
  return res.json();
}
export async function fetchAdminTeam() {
  const res = await fetch(`${API}/admin`);
  if (!res.ok) throw new Error("Failed to fetch team");
  return res.json();
}

/* POST /api/team/admin  →  Create member */
export async function createMember(data) {
  const res = await fetch(`${API}/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to create member");
  return json;
}

/* PATCH /api/team/admin/:id  →  Update member */
export async function updateMember(id, data) {
  const res = await fetch(`${API}/admin/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to update member");
  return json;
}

/* DELETE /api/team/admin/:id  →  Delete member */
export async function deleteMember(id) {
  const res = await fetch(`${API}/admin/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to delete member");
  return json;
}

/* PATCH /api/team/admin/:id/status  →  Quick status toggle */
export async function updateMemberStatus(id, status) {
  const res = await fetch(`${API}/admin/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to update status");
  return json;
}
