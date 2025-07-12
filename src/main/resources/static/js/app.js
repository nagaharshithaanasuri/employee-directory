let editId=null;
let currentEmployees=[...employees]
let currentPage = 1;
let itemsPerPage = 10;

function displayEmployees(list) {
  currentEmployees = list;
  const container = document.getElementById('employee-list-container');
  container.innerHTML = '';

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedList = list.slice(startIndex, endIndex);

  paginatedList.forEach(emp => {
    const card = document.createElement('div');
    card.className = 'employee-card';
    card.innerHTML = `
      <strong>${emp.firstName} ${emp.lastName}</strong><br><br>
      <span><strong>Email:</strong> ${emp.email}</span><br>
      <span><strong>Department:</strong> ${emp.department}</span><br>
      <span><strong>Role:</strong> ${emp.role}</span><br><br>
      <div class="button-group1">
        <button onclick="editEmployee(${emp.id})">Edit</button>
        <button onclick="deleteEmployee(${emp.id})">Delete</button>
      </div>
    `;
    container.appendChild(card);
  });

  renderPaginationControls(list.length);
}


function handleSort() {
  const option = document.getElementById('sortOption').value;
  let sorted = [...currentEmployees];

  if (option === 'name-asc') {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  } else if (option === 'name-desc') {
    sorted.sort((a, b) => b.name.localeCompare(a.name));
  } else if (option === 'dept-asc') {
    sorted.sort((a, b) => a.department.localeCompare(b.department));
  } else if (option === 'dept-desc') {
    sorted.sort((a, b) => b.department.localeCompare(a.department));
  }

  displayEmployees(sorted);
}

function renderPaginationControls(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const container = document.getElementById('pagination-controls');
  container.innerHTML = '';

  if (totalPages <= 1) return;

  const prevBtn = document.createElement('button');
  prevBtn.textContent = '⏮ Prev';
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    currentPage--;
    displayEmployees(currentEmployees);
  };

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next ⏭';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    currentPage++;
    displayEmployees(currentEmployees);
  };

  container.appendChild(prevBtn);
  container.appendChild(document.createTextNode(` Page ${currentPage} of ${totalPages} `));
  container.appendChild(nextBtn);
}

function changeItemsPerPage() {
  itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
  currentPage = 1;
  displayEmployees(currentEmployees);
}

function handleSearch() {
  const query = document.getElementById('searchBar').value.toLowerCase();
  const filtered = employees.filter(emp =>
    emp.firstName.toLowerCase().includes(query) ||
    emp.email.toLowerCase().includes(query)
  );
  displayEmployees(filtered);
}

function editEmployee(id) {
  const emp = employees.find(e => e.id === id);
  if (!emp) return;

  editId = id;
  document.getElementById('editFName').value = emp.firstName;
  document.getElementById('editLName').value = emp.lastName;
  document.getElementById('editEmail').value = emp.email;
  document.getElementById('editDepartment').value = emp.department;
  document.getElementById('editRole').value = emp.role;

  document.getElementById('editModal').style.display = 'block';
}

function closeEditModal() {
  document.getElementById('editModal').style.display = 'none';
}

document.getElementById('editEmployeeForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const fname = document.getElementById('editFName').value;
  const lname = document.getElementById('editLName').value;
  const email = document.getElementById('editEmail').value;
  const department = document.getElementById('editDepartment').value;
  const role = document.getElementById('editRole').value;

  const emp = employees.find(e => e.id === editId);
  if (emp) {
    emp.firstName = fname;
    emp.lastName=lname;
    emp.email = email;
    emp.department = department;
    emp.role = role;
  }

  displayEmployees(employees);
  closeEditModal();
});

// Show Add Modal
document.getElementById('addEmployeeBtn').addEventListener('click', () => {
  document.getElementById('addModal').style.display = 'block';
});

// Close Add Modal
function closeAddModal() {
  document.getElementById('addModal').style.display = 'none';
}


document.getElementById('addEmployeeForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const newEmp = {
    id: Date.now(), // unique ID
    firstName: `${document.getElementById('addFirstName').value}`,
     lastName: `${document.getElementById('addLastName').value}`,
    email: document.getElementById('addEmail').value,
    department: document.getElementById('addDepartment').value,
    role: document.getElementById('addRole').value
  };

  employees.push(newEmp);
  displayEmployees(employees);
  closeAddModal();

  this.reset(); // clear form
});

function deleteEmployee(id) {
  const confirmDelete = confirm("Are you sure you want to delete this employee?");
  if (confirmDelete) {
    const index = employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      employees.splice(index, 1); // remove from array
      displayEmployees(employees); // refresh view
    }
  }
}

function applyFilters() {
  const nameVal = document.getElementById('filterName').value.toLowerCase();
  const deptVal = document.getElementById('filterDepartment').value.toLowerCase();
  const roleVal = document.getElementById('filterRole').value.toLowerCase();

  const filtered = employees.filter(emp =>
    emp.firstName.toLowerCase().includes(nameVal) &&
    emp.department.toLowerCase().includes(deptVal) &&
    emp.role.toLowerCase().includes(roleVal)
  );

  currentPage = 1;
  displayEmployees(filtered);
}

function resetFilters() {
  document.getElementById('filterName').value = '';
  document.getElementById('filterDepartment').value = '';
  document.getElementById('filterRole').value = '';

  currentPage = 1;
  displayEmployees(employees);
}

document.addEventListener("DOMContentLoaded", () => {
  displayEmployees(employees);
});
