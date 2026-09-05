const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const CITIZEN_COUNT = 1958;
const DEFAULT_PASSWORD = 'montmell2026';

const COUNCIL_MEMBERS = [
  { name: 'Maria', email: 'maria@elmontmell.cat' },
  { name: 'Juan', email: 'juan@elmontmell.cat' },
  { name: 'Ana', email: 'ana@elmontmell.cat' },
];

const SAMPLE_INCIDENT_TITLES = [
  'Farola fundida en Carrer Major',
  'Bache en la Avinguda del Penedes',
  'Contenedor de basura desbordado',
  'Fuga de agua en la plaza del ayuntamiento',
  'Semaforo averiado en el cruce del cementerio',
  'Grafiti en el muro del colegio',
  'Rama caida bloqueando la acera',
  'Papelera rota en el parque infantil',
];

async function main() {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  const municipality = await prisma.municipality.upsert({
    where: { slug: 'el-montmell' },
    update: {},
    create: {
      name: 'El Montmell',
      slug: 'el-montmell',
      licenseTier: 'FREE',
    },
  });

  const mayor = await prisma.user.upsert({
    where: { email: 'alcalde@elmontmell.cat' },
    update: {},
    create: {
      email: 'alcalde@elmontmell.cat',
      name: 'Alcalde de El Montmell',
      role: 'MAYOR',
      passwordHash,
      municipalityId: municipality.id,
    },
  });

  const councilUsers = [];
  for (const member of COUNCIL_MEMBERS) {
    const user = await prisma.user.upsert({
      where: { email: member.email },
      update: {},
      create: {
        email: member.email,
        name: `Concejala/l ${member.name}`,
        role: 'COUNCIL',
        passwordHash,
        municipalityId: municipality.id,
      },
    });
    councilUsers.push(user);
  }

  console.log(`Sembrando ${CITIZEN_COUNT} vecinos ficticios...`);

  const citizenData = Array.from({ length: CITIZEN_COUNT }).map((_, i) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    return {
      email: faker.internet
        .email({ firstName, lastName, provider: 'vecinos-montmell.test' })
        .toLowerCase()
        + `.${i}`, // guarantee uniqueness across 1958 rows
      name: `${firstName} ${lastName}`,
      role: 'CITIZEN',
      passwordHash,
      municipalityId: municipality.id,
    };
  });

  // createMany in chunks to keep a single INSERT from growing too large.
  const CHUNK_SIZE = 250;
  for (let i = 0; i < citizenData.length; i += CHUNK_SIZE) {
    const chunk = citizenData.slice(i, i + CHUNK_SIZE);
    await prisma.user.createMany({ data: chunk, skipDuplicates: true });
  }

  const someCitizens = await prisma.user.findMany({
    where: { municipalityId: municipality.id, role: 'CITIZEN' },
    take: 20,
  });

  console.log('Sembrando incidencias de ejemplo...');

  for (let i = 0; i < SAMPLE_INCIDENT_TITLES.length; i++) {
    const reporter = someCitizens[i % someCitizens.length];
    const isAssigned = i % 3 === 0;

    await prisma.incident.create({
      data: {
        title: SAMPLE_INCIDENT_TITLES[i],
        description: faker.lorem.sentences(2),
        status: isAssigned ? 'ASSIGNED' : 'PENDING',
        municipalityId: municipality.id,
        reportedById: reporter.id,
        assignedToId: isAssigned ? councilUsers[i % councilUsers.length].id : null,
        estimatedTime: isAssigned ? '2 horas' : null,
        lastComment: isAssigned ? 'Equipo de mantenimiento avisado.' : null,
      },
    });
  }

  console.log('Seed completado:');
  console.log(`  Municipio: ${municipality.name} (licencia ${municipality.licenseTier})`);
  console.log(`  Alcalde: ${mayor.email}`);
  console.log(`  Concejales: ${councilUsers.map((u) => u.email).join(', ')}`);
  console.log(`  Vecinos: ${CITIZEN_COUNT}`);
  console.log(`  Password de todos los usuarios sembrados: ${DEFAULT_PASSWORD}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
