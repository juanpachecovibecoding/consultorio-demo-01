import React, { useState, useEffect, useMemo } from 'react';
import { 
  MessageCircle, 
  MapPin, 
  Clock, 
  Phone, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Stethoscope,
  Search,
  HeartPulse,
  Brain,
  Smile,
  FlaskConical,
  Activity,
  Users,
  Calendar,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';

interface Professional {
  name: string;
  specialty: string;
  category: 'clinica' | 'mental' | 'mujer-piel' | 'nutricion' | 'laboratorio' | 'especialidades';
  role?: string;
  badge?: string;
}

const PROFESSIONALS: Professional[] = [
  // Cardiología
  { name: 'Dra. Daniela Paviolo', specialty: 'Cardiología', category: 'clinica', badge: 'Salud Cardiovascular' },
  { name: 'Dr. Enrique Ucedo', specialty: 'Cardiología', category: 'clinica', badge: 'Salud Cardiovascular' },
  
  // Clínica Médica & Nefrología
  { name: 'Dra. Ma. Cecilia Cargnello', specialty: 'Clínica Médica', category: 'clinica', badge: 'Atención Integral' },
  { name: 'Dra. Adriana Carrizo', specialty: 'Clínica Médica - Nefrología', category: 'clinica', badge: 'Salud Renal' },
  
  // Coloproctología
  { name: 'Dra. Indiana Venetucci', specialty: 'Coloproctología', category: 'especialidades', badge: 'Especialista' },
  
  // Dermatología, Ginecología, Estética
  { name: 'Dra. Flavia Risso', specialty: 'Dermatología', category: 'mujer-piel', badge: 'Cuidado de la Piel' },
  { name: 'Dra. Ma. Cristina Paz', specialty: 'Ginecología', category: 'mujer-piel', badge: 'Salud Femenina' },
  { name: 'Dra. Estela Alvarez', specialty: 'Medicina Estética', category: 'mujer-piel', badge: 'Estética Médica' },
  
  // Neumonología
  { name: 'Dra. Virginia Larivey', specialty: 'Neumonología', category: 'clinica', badge: 'Salud Respiratoria' },
  
  // Nutrición
  { name: 'Lic. Ma. de los Milagros Edsberg', specialty: 'Nutrición', category: 'nutricion', badge: 'Planes Nutricionales' },
  { name: 'Lic. Natalia Amsler', specialty: 'Nutrición', category: 'nutricion', badge: 'Planes Nutricionales' },
  { name: 'Lic. Vanina Carballo', specialty: 'Nutrición', category: 'nutricion', badge: 'Planes Nutricionales' },
  
  // Psicología
  { name: 'Lic. Silvana Basaldella', specialty: 'Psicología', category: 'mental', badge: 'Psicoterapia' },
  
  // Psiquiatría
  { name: 'Dr. Carlos Prono', specialty: 'Psiquiatría', category: 'mental', badge: 'Salud Mental' },
  { name: 'Dr. Jose Luis Kot', specialty: 'Psiquiatría', category: 'mental', badge: 'Salud Mental' },
  { name: 'Dr. Mirko Ambrosini', specialty: 'Psiquiatría', category: 'mental', badge: 'Salud Mental' },
  { name: 'Dra. Melisa Mattioli', specialty: 'Psiquiatría', category: 'mental', badge: 'Salud Mental' },
  { name: 'Dr. Gustavo Cassano', specialty: 'Psiquiatría', category: 'mental', badge: 'Salud Mental' },
  
  // Reumatología
  { name: 'Dr. Jose Luis Olivieri', specialty: 'Reumatología', category: 'clinica', badge: 'Articulaciones & Inmunología' },
  
  // Laboratorio
  { name: 'Equipo Bioquímico', specialty: 'Laboratorio de Análisis Clínicos', category: 'laboratorio', badge: 'Bioquímica Clínica' },
];

const CATEGORIES = [
  { id: 'all', label: 'Todas las Especialidades', icon: Stethoscope },
  { id: 'clinica', label: 'Clínica & Especialidades', icon: HeartPulse },
  { id: 'mental', label: 'Salud Mental (Psiquiatría y Psicología)', icon: Brain },
  { id: 'mujer-piel', label: 'Dermatología, Ginecología & Estética', icon: Sparkles },
  { id: 'nutricion', label: 'Nutrición', icon: Activity },
  { id: 'laboratorio', label: 'Laboratorio', icon: FlaskConical },
];

export default function LandingPage() {
  const [clinic, setClinic] = useState<any>({
    clinicName: 'Nuevo Plaza Consultorios',
    phone: '4528700',
    whatsappNumber: '3425162484',
    address: 'Santa Fe Capital',
    city: 'Santa Fe, Argentina',
    workingHours: 'Lunes a Viernes de 08:00 a 20:00 hs',
    insurances: 'Obras Sociales, Prepagas y Consulta Particular'
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
            clinicName: data.clinic.clinicName || 'Nuevo Plaza Consultorios',
            phone: data.clinic.phone || '4528700',
            whatsappNumber: data.clinic.whatsappNumber || '3425162484',
          }));
        }
      })
      .catch(() => {});
  }, []);

  const cleanWaNumber = (clinic.whatsappNumber || '3425162484').replace(/\D/g, '');
  const waBaseUrl = `https://wa.me/549${cleanWaNumber.startsWith('549') ? cleanWaNumber.slice(3) : cleanWaNumber}`;
  
  const getWaLinkForDoctor = (profName: string, specialty: string) => {
    const text = encodeURIComponent(`Hola, me comunico con Nuevo Plaza Consultorios. Quisiera consultar para solicitar un turno con ${profName} (${specialty}).`);
    return `${waBaseUrl}?text=${text}`;
  };

  const heroWaUrl = `${waBaseUrl}?text=${encodeURIComponent('Hola, me comunico con Nuevo Plaza Consultorios. Quisiera consultar sobre turnos y especialidades.')}`;
  const labWaUrl = `${waBaseUrl}?text=${encodeURIComponent('Hola, quisiera consultar por análisis clínicos en el Laboratorio de Nuevo Plaza Consultorios.')}`;

  // Filtrado de profesionales
  const filteredProfessionals = useMemo(() => {
    return PROFESSIONALS.filter(p => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const cleanSearch = searchTerm.toLowerCase().trim();
      const matchesSearch = cleanSearch === '' || 
        p.name.toLowerCase().includes(cleanSearch) || 
        p.specialty.toLowerCase().includes(cleanSearch) ||
        (p.badge && p.badge.toLowerCase().includes(cleanSearch));
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const fullAddressQuery = encodeURIComponent(`${clinic.address || 'Santa Fe'}, ${clinic.city || 'Santa Fe, Argentina'}`);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${fullAddressQuery}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-600 selection:text-white">
      
      {/* 1. TOP BAR INSTITUCIONAL */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {clinic.address}, {clinic.city}
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {clinic.workingHours}
            </span>
          </div>
          <div className="flex items-center gap-4 font-medium">
            <a 
              href={`tel:${clinic.phone}`} 
              className="flex items-center gap-1.5 hover:text-white transition"
              title="Llamar al teléfono fijo"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" /> 
              <span>Tel: <strong>{clinic.phone}</strong></span>
            </a>
            <span className="text-slate-600">|</span>
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

      {/* 2. HEADER CON LOGOTIPO FIEL A LA PLACA */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex justify-between items-center">
          
          {/* Logo Estilo Placa Institucional */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="font-logo-nuevo text-3xl sm:text-4xl text-slate-900 group-hover:text-emerald-900 transition leading-none">
                  Nuevo
                </span>
                <span className="font-logo-plaza italic font-bold text-2xl sm:text-3xl text-slate-900 group-hover:text-emerald-950 transition leading-none">
                  Plaza
                </span>
              </div>
              
              {/* Barra decorativa degradada */}
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-slate-400 to-transparent my-1"></div>
              
              <span className="text-[10px] sm:text-[11px] tracking-[0.25em] font-semibold text-slate-700 uppercase text-center">
                CONSULTORIOS
              </span>
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-slate-400 to-transparent mt-0.5"></div>
            </div>
          </a>

          {/* Navegación Desktop */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <a href="#especialidades" className="hover:text-emerald-700 transition">Especialidades</a>
            <a href="#profesionales" className="hover:text-emerald-700 transition">Cuerpo Médico</a>
            <a href="#laboratorio" className="hover:text-emerald-700 transition">Laboratorio</a>
            <a href="#ubicacion" className="hover:text-emerald-700 transition">Ubicación</a>
          </nav>

          {/* Botón WhatsApp de Cabecera */}
          <div className="flex items-center gap-3">
            <a 
              href={heroWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Solicitar Turno</span>
            </a>
          </div>

        </div>
      </header>

      {/* 3. HERO SECTION - POLICLÍNICA MULTIDISCIPLINARIA */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100 py-14 sm:py-20 border-b border-slate-200">
        
        {/* Adornos sutiles de fondo */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-teal-100/30 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="max-w-3xl">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Centro Médico Multidisciplinario en Santa Fe
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Atención médica integral con especialistas de confianza en un solo lugar.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 mt-5 leading-relaxed font-normal">
              En <strong>Nuevo Plaza Consultorios</strong> reunimos un equipo multidisciplinario de más de 18 profesionales de la salud, cubriendo 13 especialidades médicas y servicio de laboratorio de análisis clínicos propio.
            </p>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mt-8">
              <a 
                href={heroWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.02]"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Consultar Turno por WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a 
                href="#profesionales"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm sm:text-base border border-slate-300 shadow-xs transition"
              >
                <Search className="w-4 h-4 text-slate-500" />
                <span>Buscar Profesional o Especialidad</span>
              </a>
            </div>

            {/* Métricas / Badges de Confianza */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-200/80">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900">13+</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Especialidades Médicas</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900">18+</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Profesionales de la Salud</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-emerald-700">Propio</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Laboratorio de Análisis</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900">Santa Fe</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Atención Centralizada</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. DIRECTORIO INTERACTIVO DE PROFESIONALES & ESPECIALIDADES */}
      <section id="profesionales" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-3">
              <Users className="w-3.5 h-3.5" /> Cuerpo Médico & Staff
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Especialistas y Profesionales
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
              Encuentra a tu médico por nombre o busca la especialidad médica que necesitas.
            </p>
          </div>

          {/* Buscador Rápido en Vivo */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar médico o especialidad..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Filtros por Categorías */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Contador de resultados */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-6 font-medium">
          <span>Mostrando <strong>{filteredProfessionals.length}</strong> profesional(es)</span>
          {searchTerm && <span>Filtro activo: "{searchTerm}"</span>}
        </div>

        {/* Grid de Tarjetas de Profesionales */}
        {filteredProfessionals.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No se encontraron resultados</h3>
            <p className="text-xs text-slate-500 mt-1">
              Prueba buscando por otra palabra clave o restablece los filtros.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
            >
              Ver todos los profesionales
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProfessionals.map((prof, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-emerald-300 transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-wider">
                      {prof.specialty}
                    </span>
                    {prof.badge && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 shrink-0">
                        {prof.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-950 transition">
                    {prof.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                    Nuevo Plaza Consultorios
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">Atención con turno</span>
                  <a
                    href={getWaLinkForDoctor(prof.name, prof.specialty)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white px-3.5 py-2 rounded-xl transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Pedir Turno</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </section>

      {/* 5. MÓDULO DESTACADO: LABORATORIO DE ANÁLISIS CLÍNICOS */}
      <section id="laboratorio" className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/30">
                <FlaskConical className="w-3.5 h-3.5" />
                Servicio Bioquímico Integrado
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Laboratorio de Análisis Clínicos
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed">
                Contamos con servicio bioquímico propio dentro de las instalaciones para mayor comodidad de nuestros pacientes. Realizamos extracciones y estudios de rutina y especializados con resultados ágiles y confiables.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Análisis de Rutina & Chequeos</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Hemogramas, glucemia, lipidograma, orina completa y perfiles hormonales.</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Atención a Obras Sociales</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Aceptamos principales obras sociales, prepagas y consultas particulares.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4 items-center">
                <a 
                  href={labWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Consultar por Análisis Clínicos</span>
                </a>
                <span className="text-xs text-slate-400">
                  Extracciones por orden médica y turnos programados.
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" /> Horarios de Laboratorio
              </h3>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">Extracciones de sangre:</span>
                  <span className="font-bold text-white">Lunes a Viernes 07:30 a 10:30 hs</span>
                </li>
                <li className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">Entrega de resultados:</span>
                  <span className="font-bold text-white">Digital / Presencial</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-400">Consultas bioquímicas:</span>
                  <span className="font-bold text-emerald-300">Vía WhatsApp</span>
                </li>
              </ul>
              <div className="mt-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs">
                💡 <strong>Importante:</strong> Consulta previamente los requisitos de ayuno o preparación previa según el estudio solicitado por tu médico.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. CÓMO SOLICITAR TURNO */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Atención Rápida
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            ¿Cómo agendar tu consulta en Nuevo Plaza?
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Tres simples pasos para coordinar tu consulta médica sin pérdidas de tiempo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black flex items-center justify-center text-sm mb-4">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">Elegí la Especialidad</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Busca en nuestro directorio el profesional o especialidad que necesitas para tu atención médica.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-sm mb-4">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">Comunicate por WhatsApp</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Escríbenos directamente o llámanos al (0342) 4528700 para consultar días, horarios disponibles y cobertura.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black flex items-center justify-center text-sm mb-4">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">Confirmación & Recordatorio</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Tu turno queda registrado y te enviamos un recordatorio previo a la consulta para tu tranquilidad.
            </p>
          </div>
        </div>
      </section>

      {/* 7. UBICACIÓN, MAPA & CONTACTO */}
      <section id="ubicacion" className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Info de Contacto */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
                  Ubicación & Contacto
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  Visítanos en Santa Fe
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Atención integral y consultorios confortables equipados para el cuidado de tu salud.
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Dirección</h4>
                    <p className="text-slate-700 text-xs mt-0.5">{clinic.address}, {clinic.city}</p>
                    <a 
                      href={googleMapsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 mt-1 hover:underline"
                    >
                      <span>Ver en Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Teléfonos Directos</h4>
                    <p className="text-xs text-slate-700 mt-0.5">
                      Fijo: <a href={`tel:${clinic.phone}`} className="font-bold hover:underline">{clinic.phone}</a>
                    </p>
                    <p className="text-xs text-slate-700 mt-0.5">
                      WhatsApp: <a href={heroWaUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-700 hover:underline">342 5162484</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Horarios de Atención</h4>
                    <p className="text-slate-700 text-xs mt-0.5">{clinic.workingHours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mapa Embed de Google Maps */}
            <div className="lg:col-span-7 h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative bg-slate-100">
              <iframe 
                src="https://maps.google.com/maps?q=Santa%20Fe%2C%20Argentina&t=&z=14&ie=UTF8&iwloc=&output=embed"
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

      {/* 8. FOOTER INSTITUCIONAL */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8 border-b border-slate-800">
            
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-baseline gap-1.5">
                <span className="font-logo-nuevo text-3xl text-white leading-none">
                  Nuevo
                </span>
                <span className="font-logo-plaza italic font-bold text-2xl text-white leading-none">
                  Plaza
                </span>
              </div>
              <span className="text-[10px] tracking-[0.25em] font-semibold text-slate-400 uppercase mt-1">
                CONSULTORIOS
              </span>
              <p className="text-slate-500 text-[11px] mt-2">
                Centro Médico Multidisciplinario • Santa Fe, Argentina
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 font-semibold text-slate-300">
              <a href="#especialidades" className="hover:text-white transition">Especialidades</a>
              <a href="#profesionales" className="hover:text-white transition">Profesionales</a>
              <a href="#laboratorio" className="hover:text-white transition">Laboratorio</a>
              <a href="#ubicacion" className="hover:text-white transition">Ubicación</a>
              <a href="/admin" className="text-emerald-400 hover:text-emerald-300 transition">Acceso Profesional</a>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} Nuevo Plaza Consultorios. Todos los derechos reservados.</p>
            <p>Tel: (0342) 4528700 • WhatsApp: 342 5162484</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
