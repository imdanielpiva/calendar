const $app = document.querySelector('#app');
const $getEventsBtn = $app.querySelector('#get-user-events');

window.addEventListener('load', bootApp);

const h = (tag = 'div', qty = 0) => {
  if (qty === 0) return document.createElement(tag);

  const elements = [];

  for (let i = 0; i < qty; i += 1) {
    elements.push(h(tag));
  }

  return elements;
};

function bootApp() {
  const socket = io('http://localhost:3000');

  socket.on('authflow::end', (events) => {
    console.log('authflow::end', events);

    mountTableContent(events);

    $getEventsBtn.disabled = false;
  });

  socket.on('authflow::insertcodefrom', (authUrl) => {
    window.open(authUrl, "_blank", "toolbar=no,scrollbars=yes,resizable=yes,top=100,left=500,width=640,height=480");

    mountCodeInput(socket);
  });

  $getEventsBtn.addEventListener('click', async () => {
    socket.emit('authflow::start', 'imdanielpiva@gmail.com');

    $getEventsBtn.disabled = true;
  });
}

function mountCodeInput(socket) {
  const $parent = document.createElement('div');
  const $codeInput = document.createElement('input');
  const $submitBnt = document.createElement('button');

  $parent.id = 'code';
  
  $codeInput.type = 'text';
  $codeInput.placeholder = 'Cole aqui o código';

  $submitBnt.textContent = 'Autenticar';

  const sendAuthCode = () => {
    socket.emit('authflow::codeinserted', $codeInput.value);

    $submitBnt.removeEventListener('click', sendAuthCode);
    $parent.remove();
  };

  $submitBnt.addEventListener('click', sendAuthCode);

  $parent.appendChild($codeInput);
  $parent.appendChild($submitBnt);

  $app.appendChild($parent);
}

function mountTableContent(eventsList) {
  const $table = document.querySelector('table');

  $table.innerHTML = `
    <tbody>
      <tr>
          <th>Título</th>
          <th>Status</th>
          <th>Ínicio</th>
          <th>Fim</th>
          <th>Criado em</th>
          <th>Última atualização</th>
          <th>Criador</th>
          <th>Organizador</th>
          <th>Link</th>
      </tr>
    </tbody>
  `;

  eventsList
    .map((event) => {
      const $row = h('tr');

      mountRowContent(event).map(item => $row.appendChild(item));

      return $row;
    })
    .map($row => $table.appendChild($row));
}

function mountRowContent(event) {
  const elements = h('td', 10);

  const [
    $title,
    $status,
    $start,
    $end,
    $createdAt,
    $lastUpdated,
    $creator,
    $organizer,
    $link
  ] = elements;

  $title.textContent = event.summary;
  $status.textContent = event.status;
  $start.textContent = new Date(event.start.dateTime || event.start.date).toLocaleDateString('pt-BR');
  $end.textContent = new Date(event.end.dateTime || event.end.date).toLocaleDateString('pt-BR');
  $createdAt.textContent = new Date(event.created).toLocaleDateString('pt-BR');
  $lastUpdated.textContent = new Date(event.updated).toLocaleDateString('pt-BR');
  $creator.innerHTML = `
    <div>
      <p>${event.creator.displayName}</p>
      <p>${event.creator.email}</p>
    </div>
  `;
  $organizer.innerHTML = `
    <div>
      <p>${event.organizer.displayName}</p>
      <p>${event.organizer.email}</p>
    </div>
  `;
  $link.innerHTML = `<a href="${event.htmlLink}" target="_blank">Ver no calendário</a>`;

  return elements;
}
