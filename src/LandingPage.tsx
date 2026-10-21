import React, { useState, useEffect, useMemo } from 'react';
import { 
  MessageCircle, 
  MapPin, 
  Clock, 
  Phone, 
  ArrowRight,
  Stethoscope,
  Search,
  HeartPulse,
  Brain,
  FlaskConical,
  Activity,
  Users,
  ExternalLink,
  ShieldCheck,
  Check,
  ChevronDown
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
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleRow = (idx: number) => {
    setExpandedIndex(prev => prev === idx ? null : idx);
  };

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
      const q = searchTerm.toLowerCase().trim();
      return !q ||
        p.name.toLowerCase().includes(q) ||
        p.specialty.toLowerCase().includes(q);
    });
  }, [searchTerm]);

  const fullAddressQuery   = encodeURIComponent(`${clinic.address || 'Belgrano 3108'}, ${clinic.city || 'Santa Fe de la Vera Cruz, Santa Fe'}`);
  const googleMapsUrl      = `https://www.google.com/maps/search/?api=1&query=${fullAddressQuery}`;
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${fullAddressQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#000000] font-sans selection:bg-[#36454f] selection:text-white">

      {/* ── 1. TOP BAR INSTITUCIONAL (Hairline border & Pure Black) ── */}
      <div className="bg-[#000000] text-[#d3d3d3] text-[11px] tracking-wide py-2.5 px-4 sm:px-10 border-b border-[#36454f]/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-6 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-2 text-[#d3d3d3]">
              <MapPin className="w-3 h-3 text-[#808080] shrink-0" />
              {clinic.address}, {clinic.city}
            </span>
            <span className="hidden md:flex items-center gap-2 text-[#808080]">
              <Clock className="w-3 h-3 text-[#808080] shrink-0" />
              {clinic.workingHours}
            </span>
          </div>
          <div className="flex items-center gap-6 font-medium text-[#d3d3d3]">
            <a href={`tel:${clinic.phone}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3 h-3 text-[#808080]" />
              <span>Tel: <strong className="text-white font-mono">{clinic.phone}</strong></span>
            </a>
            <span className="text-[#36454f]">/</span>
            <a
              href={heroWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white hover:text-[#d3d3d3] transition-colors"
            >
              <MessageCircle className="w-3 h-3 text-[#d3d3d3]" />
              <span>WhatsApp: <strong className="font-mono">342 5162484</strong></span>
            </a>
          </div>
        </div>
      </div>

      {/* ── 2. HEADER SUISSE BOUTIQUE (Hairline border, minimalismo tipográfico) ── */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-[#d3d3d3] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-10 py-4 flex justify-between items-center">

          {/* Logotipo fiel a la placa original */}
          <a href="#" className="flex flex-col group shrink-0 py-0.5">
            <div className="font-logo-nuevo text-3xl sm:text-4xl text-[#000000] group-hover:text-[#36454f] transition-colors leading-none tracking-normal">
              Nuevo Plaza
            </div>
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#808080] to-transparent my-1"></div>
            <span className="font-logo-sub text-[9.5px] sm:text-[10.5px] tracking-[0.3em] font-semibold text-[#36454f] uppercase text-center pl-[0.3em]">
              CONSULTORIOS
            </span>
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#808080] to-transparent mt-0.5"></div>
          </a>

          {/* Navegación Desktop - Estilo Editorial Suizo */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] font-medium tracking-wide text-[#36454f]">
            <a href="#profesionales" className="hover:text-[#000000] transition-colors py-1">Cuerpo Médico</a>
            <a href="#laboratorio"   className="hover:text-[#000000] transition-colors py-1">Laboratorio</a>
            <a href="#coberturas"    className="hover:text-[#000000] transition-colors py-1">Coberturas</a>
            <a href="#ubicacion"     className="hover:text-[#000000] transition-colors py-1">Ubicación</a>
          </nav>

          {/* CTA con Inversión Suiza: borde #36454f, hover se invierte a sólido negro */}
          <a
            href={heroWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#36454f] bg-transparent text-[#000000] hover:bg-[#000000] hover:text-white font-semibold text-xs tracking-wide transition-all duration-200 shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Solicitar Turno</span>
          </a>

        </div>
      </header>

      {/* ── 3. HERO (Estilo Clínica Boutique Suiza: Gran respiración, sobriedad y arquitectura) ── */}
      <section className="relative overflow-hidden bg-[#000000] text-white border-b border-[#36454f]">

        {/* Patrón de grilla milimétrica casi invisible (Swiss Architectural Grid) */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-10 py-20 sm:py-28">
          <div className="max-w-3xl">

            {/* Micro-etiqueta arquitectónica */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-[#36454f] bg-[#36454f]/30 text-[#d3d3d3] text-[10.5px] font-mono tracking-widest uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              CENTRO MÉDICO MULTIDISCIPLINARIO · SANTA FE
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
              Salud integral con especialistas de confianza en un solo lugar.
            </h1>

            <p className="text-sm sm:text-lg text-[#d3d3d3] mt-6 leading-relaxed font-normal max-w-2xl">
              En <strong className="text-white font-semibold">Nuevo Plaza Consultorios</strong> reunimos más de
              18 profesionales de la salud en 13 especialidades médicas, junto a servicio de laboratorio de análisis
              clínicos propio, en el corazón de Santa Fe.
            </p>

            {/* Acciones principales - Botones con inversión de color */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-10">
              <a
                href={heroWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-lg bg-white text-[#000000] hover:bg-[#d3d3d3] font-bold text-sm tracking-wide transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4 text-[#36454f]" />
                <span>Consultar Turno por WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#profesionales"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-lg border border-[#808080]/40 text-white hover:bg-white/10 font-medium text-sm tracking-wide transition-all duration-200"
              >
                <Search className="w-3.5 h-3.5 text-[#d3d3d3]" />
                <span>Ver Cuerpo Médico</span>
              </a>
            </div>

            {/* Estadísticas de precisión suiza: separadas por finas líneas verticales */}
            <div className="grid grid-cols-3 gap-6 sm:gap-10 mt-14 pt-10 border-t border-[#36454f]/80 max-w-xl">
              <div className="border-l border-[#36454f] pl-4 sm:pl-6">
                <p className="text-2xl sm:text-4xl font-mono font-bold text-white tracking-tight">13+</p>
                <p className="text-[11px] font-mono tracking-widest text-[#808080] uppercase mt-1">Especialidades</p>
              </div>
              <div className="border-l border-[#36454f] pl-4 sm:pl-6">
                <p className="text-2xl sm:text-4xl font-mono font-bold text-white tracking-tight">18+</p>
                <p className="text-[11px] font-mono tracking-widest text-[#808080] uppercase mt-1">Profesionales</p>
              </div>
              <div className="border-l border-[#36454f] pl-4 sm:pl-6">
                <p className="text-2xl sm:text-4xl font-mono font-bold text-white tracking-tight">LAB</p>
                <p className="text-[11px] font-mono tracking-widest text-[#808080] uppercase mt-1">Análisis Propio</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. DIRECTORIO DE PROFESIONALES (Swiss Medical Directory) ── */}
      <section id="profesionales" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-10">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#d3d3d3]">
          <div>
            <div className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#808080] mb-2">
              01 / CUERPO MÉDICO
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#000000] tracking-tight">
              Especialistas y Profesionales
            </h2>
            <p className="text-sm text-[#808080] mt-1 max-w-xl font-normal">
              Buscá por nombre o especialidad y solicitá tu turno directo por WhatsApp.
            </p>
          </div>

          {/* Buscador minimalista de precisión */}
          <div className="w-full md:w-80 relative shrink-0">
            <Search className="w-4 h-4 text-[#808080] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar médico o especialidad..."
              className="w-full pl-10 pr-10 py-3 rounded-lg border border-[#d3d3d3] bg-white text-sm text-[#000000] placeholder-[#808080] focus:outline-none focus:border-[#000000] transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#808080] hover:text-[#000000] font-mono"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Listado en filas (Directorio Médico Elegante & Accesible) */}
        {filteredProfessionals.length === 0 ? (
          <div className="bg-slate-50 rounded-xl p-14 text-center border border-[#d3d3d3] max-w-md mx-auto">
            <Search className="w-8 h-8 text-[#808080] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#000000]">Sin resultados</h3>
            <p className="text-xs text-[#808080] mt-1">Intentá con otra palabra clave o especialidad.</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-5 px-5 py-2.5 rounded-lg bg-[#000000] text-white text-xs font-semibold hover:bg-[#36454f] transition-colors"
            >
              Ver todos los profesionales
            </button>
          </div>
        ) : (
          <div className="border-t-2 border-[#000000]">
            {/* Cabecera de la tabla */}
            <div className="hidden sm:grid sm:grid-cols-12 py-3 px-4 text-[10.5px] font-mono tracking-widest text-[#808080] uppercase border-b border-[#d3d3d3]">
              <span className="col-span-7">PROFESIONAL</span>
              <span className="col-span-4">ESPECIALIDAD</span>
              <span className="col-span-1 text-right">TURNO</span>
            </div>

            {/* Filas de profesionales */}
            <div className="divide-y divide-[#d3d3d3]">
              {filteredProfessionals.map((prof, idx) => {
                const isExpanded = expandedIndex === idx;
                return (
                  <div key={idx} className="transition-colors">
                    {/* Fila tocable */}
                    <button
                      type="button"
                      onClick={() => toggleRow(idx)}
                      className={`w-full text-left py-4 sm:py-5 px-3 sm:px-4 flex items-center justify-between gap-4 transition-colors cursor-pointer ${
                        isExpanded ? 'bg-slate-50' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-11 gap-1 sm:gap-4 items-center flex-1">
                        <div className="sm:col-span-7">
                          <h3 className="text-base sm:text-lg font-bold text-[#000000] leading-snug">
                            {prof.name}
                          </h3>
                        </div>
                        <div className="sm:col-span-4">
                          <span className="text-xs sm:text-sm font-semibold text-[#36454f]">
                            {prof.specialty}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="hidden sm:inline text-[11px] font-mono text-[#808080]">
                          {isExpanded ? 'CERRAR' : 'VER'}
                        </span>
                        <ChevronDown 
                          className={`w-5 h-5 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-[#000000]' : 'text-[#808080]'
                          }`} 
                        />
                      </div>
                    </button>

                    {/* Desplegable al tocar: Botón compacto "Pedir Turno" reducido un 50% */}
                    {isExpanded && (
                      <div className="bg-slate-50/80 border-t border-[#d3d3d3]/60 px-4 sm:px-6 py-2.5 flex items-center">
                        <a
                          href={getWaLinkForDoctor(prof.name, prof.specialty)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#000000] hover:bg-[#36454f] text-white font-bold text-xs tracking-wide transition-all shadow-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-[#d3d3d3]" />
                          <span>Pedir Turno</span>
                          <ArrowRight className="w-3 h-3 text-[#d3d3d3]" />
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </section>

      {/* ── 5. LABORATORIO (Arquitectura de Alta Precisión en Charcoal #36454F) ── */}
      <section id="laboratorio" className="py-20 sm:py-28 bg-[#36454f] text-white relative overflow-hidden border-t border-[#000000]">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-10 relative z-10">
          
          <div className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#d3d3d3] mb-3">
            02 / SERVICIO BIOQUÍMICO
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-7">
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Laboratorio de Análisis Clínicos
              </h2>
              <p className="text-[#d3d3d3] text-sm sm:text-base mt-5 leading-relaxed font-normal">
                Servicio bioquímico integrado en nuestras instalaciones. Realizamos extracciones 
                y estudios de rutina y alta complejidad, con procesamiento ágil y entrega confiable de resultados.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                {[
                  { title: 'Análisis de Rutina & Chequeos', desc: 'Hemogramas, glucemia, perfiles lipídicos, función renal, hepatogramas y hormonales.' },
                  { title: 'Atención a Obras Sociales', desc: 'Coberturas médicas con orden digital o impresa y atención particular.' },
                ].map((item, i) => (
                  <div key={i} className="bg-black/20 border border-white/10 rounded-lg p-5">
                    <h4 className="text-xs font-bold text-white tracking-wide uppercase font-mono">{item.title}</h4>
                    <p className="text-xs text-[#d3d3d3] mt-2 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-9 flex flex-wrap gap-4 items-center">
                <a
                  href={labWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-white text-[#000000] hover:bg-[#d3d3d3] font-bold text-xs tracking-wide transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-[#36454f]" />
                  <span>Consultar por Análisis Clínicos</span>
                </a>
                <span className="text-xs text-[#d3d3d3] font-mono">Turnos programados y orden médica</span>
              </div>
            </div>

            {/* Ficha técnica de horarios */}
            <div className="lg:col-span-5 bg-[#000000]/40 border border-white/15 rounded-xl p-8">
              <h3 className="text-xs font-mono tracking-widest text-[#d3d3d3] uppercase mb-6 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-white" />
                CRONOGRAMA DE LABORATORIO
              </h3>
              <ul className="space-y-4 text-xs font-mono">
                {[
                  { label: 'Extracciones', value: 'Lunes a Viernes 07:30 a 10:30 hs' },
                  { label: 'Entrega de resultados', value: 'Formato Digital / Presencial' },
                  { label: 'Consultas bioquímicas', value: 'Canal WhatsApp', highlight: true },
                ].map((row, i) => (
                  <li key={i} className={`flex justify-between items-baseline gap-4 ${i < 2 ? 'border-b border-white/10 pb-4' : ''}`}>
                    <span className="text-[#808080] uppercase text-[11px]">{row.label}</span>
                    <span className={`font-bold text-right ${row.highlight ? 'text-white' : 'text-[#d3d3d3]'}`}>{row.value}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 p-4 rounded-lg bg-white/5 border border-white/10 text-xs text-[#d3d3d3] leading-relaxed">
                <p className="font-semibold text-white mb-1">Indicaciones previas:</p>
                Consultá con anticipación las horas de ayuno o preparación requerida según tu prescripción médica.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 6. COBERTURAS (Lista en Grilla de Precisión Suiza) ── */}
      <section id="coberturas" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-10">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#808080] mb-2">
            03 / CONVENIOS & COBERTURAS
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#000000] tracking-tight">
            Obras Sociales y Prepagas
          </h2>
          <p className="text-sm text-[#808080] mt-2 font-normal">
            Trabajamos con las principales prestadoras del sistema de salud y consultas particulares.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {[
            'OSDE', 'Swiss Medical', 'Galeno', 'PAMI',
            'Federada Salud', 'IOSPER', 'IOMA', 'Medifé',
            'Sancor Salud', 'Accord Salud', 'Hospital Italiano', 'Consulta Particular',
          ].map(obra => (
            <div
              key={obra}
              className="flex items-center gap-3 bg-white border border-[#d3d3d3] rounded-lg px-4 py-3.5 text-xs font-semibold text-[#000000] hover:border-[#000000] transition-colors"
            >
              <Check className="w-3.5 h-3.5 text-[#36454f] shrink-0" />
              <span>{obra}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-[#808080] mt-8">
          ¿Tu cobertura no figura en la lista?{' '}
          <a href={heroWaUrl} target="_blank" rel="noopener noreferrer" className="text-[#000000] font-bold underline decoration-[#808080] hover:decoration-[#000000] transition">
            Consultanos directamente por WhatsApp.
          </a>
        </p>
      </section>

      {/* ── 7. UBICACIÓN & CONTACTO (Líneas Arquitectónicas) ── */}
      <section id="ubicacion" className="py-20 sm:py-28 bg-slate-50/70 border-t border-[#d3d3d3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-10">
          
          <div className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#808080] mb-2">
            04 / LOCALIZACIÓN
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="text-2xl sm:text-4xl font-black text-[#000000] tracking-tight">
                  Consultorios en Santa Fe
                </h2>
                <p className="text-xs sm:text-sm text-[#808080] mt-2 leading-relaxed">
                  Infraestructura médica confortable y equipada para el cuidado integral de tu salud.
                </p>
              </div>

              <div className="space-y-3.5 text-xs">
                {[
                  {
                    icon: <MapPin className="w-4 h-4 text-[#36454f] shrink-0 mt-0.5" />,
                    title: 'DIRECCIÓN',
                    body: (
                      <>
                        <p className="text-[#000000] font-semibold text-xs mt-1">{clinic.address}, {clinic.city}</p>
                        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-[#36454f] hover:text-[#000000] mt-1.5 underline decoration-[#d3d3d3]">
                          <span>Abrir en Google Maps</span> <ExternalLink className="w-3 h-3" />
                        </a>
                      </>
                    )
                  },
                  {
                    icon: <Phone className="w-4 h-4 text-[#36454f] shrink-0 mt-0.5" />,
                    title: 'LÍNEAS DIRECTAS',
                    body: (
                      <div className="mt-1 space-y-0.5 font-mono">
                        <p className="text-[#000000]">Fijo: <a href={`tel:${clinic.phone}`} className="font-bold hover:underline">(0342) {clinic.phone}</a></p>
                        <p className="text-[#000000]">WhatsApp: <a href={heroWaUrl} target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">342 5162484</a></p>
                      </div>
                    )
                  },
                  {
                    icon: <Clock className="w-4 h-4 text-[#36454f] shrink-0 mt-0.5" />,
                    title: 'HORARIOS DE ATENCIÓN',
                    body: <p className="text-[#000000] font-semibold text-xs mt-1">{clinic.workingHours}</p>
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 rounded-lg bg-white border border-[#d3d3d3]">
                    {item.icon}
                    <div>
                      <h4 className="font-mono text-[10px] tracking-widest text-[#808080] uppercase">{item.title}</h4>
                      {item.body}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mapa con marco de precisión */}
            <div className="lg:col-span-7 h-80 sm:h-[28rem] rounded-xl overflow-hidden border border-[#d3d3d3] bg-white">
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

      {/* ── 8. FOOTER SUISSE EDITORIAL (#000000, hairline #36454f) ── */}
      <footer className="bg-[#000000] text-[#808080] py-14 border-t border-[#36454f] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-10">

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pb-10 border-b border-[#36454f]/80">

            {/* Logo footer fiel a la placa original */}
            <div className="flex flex-col items-center md:items-start">
              <div className="font-logo-nuevo text-3xl sm:text-4xl text-white leading-none">
                Nuevo Plaza
              </div>
              <div className="h-[1px] w-full max-w-[240px] bg-gradient-to-r from-transparent via-[#808080] to-transparent my-1.5"></div>
              <span className="font-logo-sub text-[9.5px] sm:text-[10.5px] tracking-[0.3em] font-semibold text-[#d3d3d3] uppercase text-center md:text-left pl-[0.3em]">
                CONSULTORIOS
              </span>
              <div className="h-[1px] w-full max-w-[240px] bg-gradient-to-r from-transparent via-[#808080] to-transparent mt-0.5"></div>
              <p className="text-[#808080] text-[11px] font-mono mt-3">Centro Médico Multidisciplinario · Belgrano 3108, Santa Fe</p>
            </div>

            {/* Enlaces de navegación rápida */}
            <div className="flex flex-wrap justify-center gap-6 font-medium text-[#d3d3d3] text-xs tracking-wide">
              <a href="#profesionales" className="hover:text-white transition-colors">Cuerpo Médico</a>
              <a href="#laboratorio"   className="hover:text-white transition-colors">Laboratorio</a>
              <a href="#coberturas"    className="hover:text-white transition-colors">Coberturas</a>
              <a href="#ubicacion"     className="hover:text-white transition-colors">Ubicación</a>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-mono text-[#808080]">
            <p>© {new Date().getFullYear()} NUEVO PLAZA CONSULTORIOS. TODOS LOS DERECHOS RESERVADOS.</p>
            <p>TEL: (0342) 4528700 · WHATSAPP: 342 5162484</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
