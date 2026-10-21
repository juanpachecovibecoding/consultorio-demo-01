import React, { useState, useEffect, useMemo } from 'react';
import { 
  MessageCircle, 
  MapPin, 
  Clock, 
  Phone, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Stethoscope,
  Search,
  HeartPulse,
  Brain,
  FlaskConical,
  Activity,
  Users,
  ExternalLink,
  Building2,
  ShieldCheck
} from 'lucide-react';

interface Professional {
  name: string;
  specialty: string;
  category: 'clinica' | 'mental' | 'mujer-piel' | 'nutricion' | 'laboratorio' | 'especialidades';
}

const PROFESSIONALS: Professional[] = [
  // Cardiología
  { name: 'Dra. Daniela Paviolo',         specialty: 'Cardiología',                     category: 'clinica'       },
  { name: 'Dr. Enrique Ucedo',             specialty: 'Cardiología',                     category: 'clinica'       },
  // Clínica Médica & Nefrología
  { name: 'Dra. Ma. Cecilia Cargnello',    specialty: 'Clínica Médica',                  category: 'clinica'       },
  { name: 'Dra. Adriana Carrizo',          specialty: 'Clínica Médica - Nefrología',     category: 'clinica'       },
  // Coloproctología
  { name: 'Dra. Indiana Venetucci',        specialty: 'Coloproctología',                 category: 'especialidades'},
  // Dermatología, Ginecología, Estética
  { name: 'Dra. Flavia Risso',             specialty: 'Dermatología',                    category: 'mujer-piel'    },
  { name: 'Dra. Ma. Cristina Paz',         specialty: 'Ginecología',                     category: 'mujer-piel'    },
  { name: 'Dra. Estela Alvarez',           specialty: 'Medicina Estética',               category: 'mujer-piel'    },
  // Neumonología
  { name: 'Dra. Virginia Larivey',         specialty: 'Neumonología',                    category: 'clinica'       },
  // Nutrición
  { name: 'Lic. Ma. de los Milagros Edsberg', specialty: 'Nutrición',                   category: 'nutricion'     },
  { name: 'Lic. Natalia Amsler',           specialty: 'Nutrición',                       category: 'nutricion'     },
  { name: 'Lic. Vanina Carballo',          specialty: 'Nutrición',                       category: 'nutricion'     },
  // Psicología
  { name: 'Lic. Silvana Basaldella',       specialty: 'Psicología',                      category: 'mental'        },
  // Psiquiatría
  { name: 'Dr. Carlos Prono',              specialty: 'Psiquiatría',                     category: 'mental'        },
  { name: 'Dr. Jose Luis Kot',             specialty: 'Psiquiatría',                     category: 'mental'        },
  { name: 'Dr. Mirko Ambrosini',           specialty: 'Psiquiatría',                     category: 'mental'        },
  { name: 'Dra. Melisa Mattioli',          specialty: 'Psiquiatría',                     category: 'mental'        },
  { name: 'Dr. Gustavo Cassano',           specialty: 'Psiquiatría',                     category: 'mental'        },
  // Reumatología
  { name: 'Dr. Jose Luis Olivieri',        specialty: 'Reumatología',                    category: 'clinica'       },
  // Laboratorio
  { name: 'Equipo Bioquímico',             specialty: 'Laboratorio de Análisis Clínicos',category: 'laboratorio'   },
];

const CATEGORIES = [
  { id: 'all',           label: 'Todos',            icon: Stethoscope },
  { id: 'clinica',       label: 'Clínica & Interna', icon: HeartPulse  },
  { id: 'mental',        label: 'Salud Mental',      icon: Brain       },
  { id: 'mujer-piel',    label: 'Mujer & Piel',      icon: Sparkles    },
  { id: 'nutricion',     label: 'Nutrición',          icon: Activity    },
  { id: 'especialidades',label: 'Especialidades',    icon: ShieldCheck },
  { id: 'laboratorio',   label: 'Laboratorio',       icon: FlaskConical},
];

// Íconos por especialidad para las tarjetas de profesionales
const SPECIALTY_COLORS: Record<string, string> = {
  'clinica':        'bg-blue-50 text-blue-700 border-blue-100',
  'mental':         'bg-violet-50 text-violet-700 border-violet-100',
  'mujer-piel':     'bg-rose-50 text-rose-700 border-rose-100',
  'nutricion':      'bg-lime-50 text-lime-700 border-lime-100',
  'especialidades': 'bg-amber-50 text-amber-700 border-amber-100',
  'laboratorio':    'bg-teal-50 text-teal-700 border-teal-100',
};

export default function LandingPage() {
  const [clinic, setClinic] = useState<any>({
    clinicName: 'Nuevo Plaza Consultorios',
    phone: '4528700',
    whatsappNumber: '3425162484',
    address: 'Belgrano 3108',
    city: 'Santa Fe de la Vera Cruz, Santa Fe',
    workingHours: 'Lunes a Viernes de 08:00 a 20:00 hs',
    insurances: 'Obras Sociales, Prepagas y Consulta Particular',
    heroImageUrl: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetch('/api/public/clinic')
      .then(res => res.json())
      .then(data => {
        if (data.clinic) {
          setClinic((prev: any) => ({
            ...prev,
            ...data.clinic,
            clinicName:     data.clinic.clinicName     || 'Nuevo Plaza Consultorios',
            phone:          data.clinic.phone          || '4528700',
            whatsappNumber: data.clinic.whatsappNumber || '3425162484',
          }));
        }
      })
      .catch(() => {});
  }, []);

  const cleanWaNumber = (clinic.whatsappNumber || '3425162484').replace(/\D/g, '');
  const waBaseUrl = `https://wa.me/549${cleanWaNumber.startsWith('549') ? cleanWaNumber.slice(3) : cleanWaNumber}`;

  const getWaLinkForDoctor = (profName: string, specialty: string) => {
    const text = encodeURIComponent(`Hola, me comunico con Nuevo Plaza Consultorios. Quisiera solicitar un turno con ${profName} (${specialty}).`);
    return `${waBaseUrl}?text=${text}`;
  };

  const heroWaUrl = `${waBaseUrl}?text=${encodeURIComponent('Hola, me comunico con Nuevo Plaza Consultorios. Quisiera consultar sobre turnos y especialidades.')}`;
  const labWaUrl  = `${waBaseUrl}?text=${encodeURIComponent('Hola, quisiera consultar por análisis clínicos en Nuevo Plaza Consultorios.')}`;

  const filteredProfessionals = useMemo(() => {
    return PROFESSIONALS.filter(p => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch = !q ||
        p.name.toLowerCase().includes(q) ||
        p.specialty.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const fullAddressQuery   = encodeURIComponent(`${clinic.address || 'Belgrano 3108'}, ${clinic.city || 'Santa Fe de la Vera Cruz, Santa Fe'}`);
  const googleMapsUrl      = `https://www.google.com/maps/search/?api=1&query=${fullAddressQuery}`;
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${fullAddressQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-600 selection:text-white">

      {/* ── 1. TOP BAR ─────────────────────────────────────────── */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              {clinic.address}, {clinic.city}
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              {clinic.workingHours}
            </span>
          </div>
          <div className="flex items-center gap-4 font-medium">
            <a href={`tel:${clinic.phone}`} className="flex items-center gap-1.5 hover:text-white transition">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tel: <strong>{clinic.phone}</strong></span>
            </a>
            <span className="text-slate-700">|</span>
            <a
              href={heroWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition font-bold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: <strong>342 5162484</strong></span>
            </a>
          </div>
        </div>
      </div>

      {/* ── 2. HEADER STICKY ───────────────────────────────────── */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex justify-between items-center">

          {/* Logotipo */}
          <a href="#" className="flex items-center gap-3 group shrink-0">
            {/* Ícono cuadrado de anclaje visual */}
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center shrink-0 group-hover:bg-emerald-900 transition">
              <span className="font-logo-nuevo text-white text-xl leading-none mt-0.5">N</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="font-logo-nuevo text-2xl sm:text-3xl text-slate-900 leading-none">Nuevo</span>
                <span className="font-logo-plaza italic font-bold text-xl sm:text-2xl text-slate-900 leading-none">Plaza</span>
              </div>
              <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-slate-400 to-transparent my-[3px]"></div>
              <span className="text-[9px] sm:text-[10px] tracking-[0.22em] font-semibold text-slate-600 uppercase text-center">
                CONSULTORIOS
              </span>
              <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-slate-400 to-transparent mt-[3px]"></div>
            </div>
          </a>

          {/* Navegación Desktop */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <a href="#profesionales" className="hover:text-emerald-700 transition">Cuerpo Médico</a>
            <a href="#laboratorio"   className="hover:text-emerald-700 transition">Laboratorio</a>
            <a href="#coberturas"    className="hover:text-emerald-700 transition">Coberturas</a>
            <a href="#ubicacion"     className="hover:text-emerald-700 transition">Ubicación</a>
          </nav>

          {/* CTA header */}
          <a
            href={heroWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-95 shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Solicitar Turno</span>
          </a>

        </div>
      </header>

      {/* ── 3. HERO ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-200">

        {/* Fondo: foto de instalaciones (si existe) o patrón médico */}
        {clinic.heroImageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${clinic.heroImageUrl})` }}
          >
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
            {/* Patrón de puntos sutil */}
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
            {/* Destellos de color */}
            <div className="absolute top-0 right-0 w-96 h-96 -mr-20 -mt-20 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
          <div className="max-w-2xl">

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-bold uppercase tracking-wider mb-5 backdrop-blur-sm">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              Centro Médico Multidisciplinario • Santa Fe
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Salud integral con especialistas de confianza en un solo lugar.
            </h1>

            <p className="text-sm sm:text-lg text-slate-300 mt-5 leading-relaxed">
              En <strong className="text-white">Nuevo Plaza Consultorios</strong> reunimos más de
              18 profesionales de la salud en 13 especialidades médicas, con laboratorio de análisis
              clínicos propio, para cuidar a toda tu familia.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mt-8">
              <a
                href={heroWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02]"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Consultar Turno por WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#profesionales"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/20 backdrop-blur-sm transition"
              >
                <Search className="w-4 h-4 text-white/70" />
                <span>Ver Cuerpo Médico</span>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-10 pt-8 border-t border-white/10">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white">13+</p>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">Especialidades</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white">18+</p>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">Profesionales</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-emerald-400">Propio</p>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">Laboratorio</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. DIRECTORIO DE PROFESIONALES ─────────────────────── */}
      <section id="profesionales" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-8">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-3 border border-emerald-100">
              <Users className="w-3.5 h-3.5" /> Cuerpo Médico
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Especialistas y Profesionales
            </h2>
            <p className="text-sm text-slate-500 mt-1.5 max-w-xl">
              Buscá por nombre o especialidad y solicitá tu turno directo por WhatsApp.
            </p>
          </div>

          {/* Buscador */}
          <div className="w-full md:w-72 relative shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar médico o especialidad..."
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filtros de categoría — etiquetas cortas */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition border ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Contador */}
        <p className="text-xs text-slate-400 font-medium mb-5">
          {filteredProfessionals.length} profesional{filteredProfessionals.length !== 1 ? 'es' : ''} encontrado{filteredProfessionals.length !== 1 ? 's' : ''}
          {searchTerm && <span className="ml-1 text-slate-500">para "{searchTerm}"</span>}
        </p>

        {/* Grid de tarjetas — sin redundancia */}
        {filteredProfessionals.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto">
            <Search className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">Sin resultados</h3>
            <p className="text-xs text-slate-500 mt-1">Intentá con otra palabra clave.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
            >
              Ver todos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProfessionals.map((prof, idx) => {
              const colorClass = SPECIALTY_COLORS[prof.category] || 'bg-slate-100 text-slate-700 border-slate-200';
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Solo un badge de especialidad, con color por categoría */}
                    <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border ${colorClass} mb-3`}>
                      {prof.specialty}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-900 transition leading-snug">
                      {prof.name}
                    </h3>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">Atención con turno</span>
                    <a
                      href={getWaLinkForDoctor(prof.name, prof.specialty)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white px-3.5 py-2 rounded-xl transition border border-emerald-100 hover:border-emerald-600"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Pedir Turno
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* ── 5. LABORATORIO ─────────────────────────────────────── */}
      <section id="laboratorio" className="py-16 bg-slate-900 text-white relative overflow-hidden">
        {/* Patrón de fondo */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="absolute right-0 top-0 w-72 h-72 -mr-20 -mt-20 rounded-full bg-emerald-600/15 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/25">
                <FlaskConical className="w-3.5 h-3.5" />
                Servicio Bioquímico Integrado
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Laboratorio de Análisis Clínicos
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed">
                Contamos con laboratorio bioquímico propio dentro de las instalaciones. Realizamos
                extracciones y estudios de rutina y especializados, con resultados ágiles y confiables
                para mayor comodidad de nuestros pacientes.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                {[
                  { title: 'Análisis de Rutina & Chequeos', desc: 'Hemogramas, glucemia, lipidograma, orina completa y perfiles hormonales.' },
                  { title: 'Atención a Obras Sociales', desc: 'Aceptamos principales obras sociales, prepagas y consulta particular.' },
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4 items-center">
                <a
                  href={labWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  Consultar por Análisis Clínicos
                </a>
                <span className="text-xs text-slate-500">Extracciones por orden médica y turnos programados.</span>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
              <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" /> Horarios de Laboratorio
              </h3>
              <ul className="space-y-3.5 text-xs">
                {[
                  { label: 'Extracciones de sangre', value: 'Lunes a Viernes 07:30 a 10:30 hs' },
                  { label: 'Entrega de resultados', value: 'Digital / Presencial' },
                  { label: 'Consultas bioquímicas', value: 'Vía WhatsApp', highlight: true },
                ].map((row, i) => (
                  <li key={i} className={`flex justify-between gap-4 ${i < 2 ? 'border-b border-white/10 pb-3.5' : ''}`}>
                    <span className="text-slate-400">{row.label}:</span>
                    <span className={`font-bold text-right ${row.highlight ? 'text-emerald-300' : 'text-white'}`}>{row.value}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs leading-relaxed">
                💡 <strong>Importante:</strong> Consultá previamente los requisitos de ayuno o preparación previa según el estudio solicitado por tu médico.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 6. COBERTURAS ──────────────────────────────────────── */}
      <section id="coberturas" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-100">
            Coberturas & Prepagas
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
            Atendemos las principales obras sociales y prepagas
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Consultá por tu cobertura particular antes de reservar tu turno.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            'OSDE', 'Swiss Medical', 'Galeno', 'PAMI',
            'Federada Salud', 'IOSPER', 'IOMA', 'Medifé',
            'Sancor Salud', 'Accord Salud', 'Hospital Italiano', 'Consulta Particular',
          ].map(obra => (
            <div
              key={obra}
              className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-700 shadow-xs hover:border-emerald-300 hover:bg-emerald-50/30 transition"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              {obra}
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          ¿No encontrás tu cobertura? <a href={heroWaUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-bold hover:underline">Consultanos directamente por WhatsApp.</a>
        </p>
      </section>

      {/* ── 7. UBICACIÓN & MAPA ────────────────────────────────── */}
      <section id="ubicacion" className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Info */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  Ubicación & Contacto
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
                  Visítanos en Santa Fe
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Instalaciones confortables y equipadas para el cuidado de tu salud y el de tu familia.
                </p>
              </div>

              <div className="space-y-3 text-sm">
                {[
                  {
                    icon: <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
                    title: 'Dirección',
                    body: (
                      <>
                        <p className="text-slate-700 text-xs mt-0.5">{clinic.address}, {clinic.city}</p>
                        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 mt-1 hover:underline">
                          Ver en Google Maps <ExternalLink className="w-3 h-3" />
                        </a>
                      </>
                    )
                  },
                  {
                    icon: <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
                    title: 'Teléfonos',
                    body: (
                      <>
                        <p className="text-xs text-slate-700 mt-0.5">Fijo: <a href={`tel:${clinic.phone}`} className="font-bold hover:underline">(0342) {clinic.phone}</a></p>
                        <p className="text-xs text-slate-700 mt-0.5">WhatsApp: <a href={heroWaUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-700 hover:underline">342 5162484</a></p>
                      </>
                    )
                  },
                  {
                    icon: <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
                    title: 'Horarios',
                    body: <p className="text-slate-700 text-xs mt-0.5">{clinic.workingHours}</p>
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    {item.icon}
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">{item.title}</h4>
                      {item.body}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mapa */}
            <div className="lg:col-span-7 h-80 sm:h-[26rem] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
              <iframe
                src={googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                title="Ubicación Nuevo Plaza Consultorios"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ── 8. FOOTER ──────────────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8 border-b border-slate-800">

            {/* Logo footer */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-baseline gap-1.5">
                <span className="font-logo-nuevo text-3xl text-white leading-none">Nuevo</span>
                <span className="font-logo-plaza italic font-bold text-2xl text-white leading-none">Plaza</span>
              </div>
              <span className="text-[9px] tracking-[0.22em] font-semibold text-slate-500 uppercase mt-1">CONSULTORIOS</span>
              <p className="text-slate-600 text-[11px] mt-2">Centro Médico Multidisciplinario • Belgrano 3108, Santa Fe</p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-5 font-semibold text-slate-400">
              <a href="#profesionales" className="hover:text-white transition">Cuerpo Médico</a>
              <a href="#laboratorio"   className="hover:text-white transition">Laboratorio</a>
              <a href="#coberturas"    className="hover:text-white transition">Coberturas</a>
              <a href="#ubicacion"     className="hover:text-white transition">Ubicación</a>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-slate-600">
            <p>© {new Date().getFullYear()} Nuevo Plaza Consultorios. Todos los derechos reservados.</p>
            <p>Tel: (0342) 4528700 · WhatsApp: 342 5162484</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
