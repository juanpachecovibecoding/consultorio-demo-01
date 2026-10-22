import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MessageCircle, 
  User, 
  Phone, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  MapPin,
  ChevronRight
} from 'lucide-react';

export default function BookingPortal() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  const [loading, setLoading] = useState(true);
  const [tokenData, setTokenData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Formulario de reserva
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [healthInsurance, setHealthInsurance] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<any>(null);

  // 1. Validar el Token al cargar la página
  useEffect(() => {
    if (!token) {
      setErrorMessage('No se ha proporcionado un enlace de reserva válido. Por favor, solicita uno a través de nuestro WhatsApp.');
      setLoading(false);
      return;
    }

    fetch(`/api/booking/validate-token/${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data.valid) {
          setTokenData(data);
          if (data.patient) {
            setName(data.patient.name || '');
            setPhone(data.patient.phone || '');
            setHealthInsurance(data.patient.healthInsurance || '');
          }
          if (data.services && data.services.length > 0) {
            setServiceId(data.services[0].id);
          }
          // Fecha sugerida: mañana
          const tmr = new Date();
          tmr.setDate(tmr.getDate() + 1);
          const defaultDate = tmr.toISOString().split('T')[0];
          setSelectedDate(defaultDate);
        } else {
          setErrorMessage(data.message || 'El enlace de reserva ha expirado o ya ha sido utilizado.');
        }
      })
      .catch(() => {
        setErrorMessage('Error de conexión al validar el enlace de reserva.');
      })
      .finally(() => setLoading(false));
  }, [token]);

  // 2. Cargar slots disponibles cuando cambia la fecha
  useEffect(() => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    fetch(`/api/booking/available-slots?date=${selectedDate}`)
      .then(res => res.json())
      .then(data => {
        setAvailableSlots(data.availableSlots || []);
        setSelectedTime('');
      })
      .catch(() => setAvailableSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate]);

  // 3. Confirmar reserva
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime) {
      alert('Por favor selecciona un horario para tu turno.');
      return;
    }
    if (!name.trim()) {
      alert('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!phone.trim()) {
      alert('Por favor ingresa tu número de WhatsApp para los recordatorios.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/booking/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          dni: tokenData.dni,
          name,
          phone,
          healthInsurance,
          serviceId,
          date: selectedDate,
          time: selectedTime
        })
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setConfirmedAppointment(result.appointment);
      } else {
        alert(result.error || 'No se pudo confirmar la reserva. Intenta nuevamente.');
      }
    } catch (e) {
      alert('Error de conexión al confirmar la reserva.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Pantalla de Carga ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="font-logo-nuevo text-4xl text-[#000000] leading-none mb-1">
            Nuevo Plaza
          </div>
          <div className="h-[1px] w-32 mx-auto bg-gradient-to-r from-transparent via-[#808080] to-transparent my-1"></div>
          <p className="font-logo-sub text-[10px] tracking-[0.3em] font-semibold text-[#36454f] uppercase text-center mb-6">
            CONSULTORIOS
          </p>
          <div className="w-8 h-8 border-2 border-[#d3d3d3] border-t-[#000000] rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-mono text-[#808080] uppercase tracking-wider">
            Verificando enlace exclusivo de reserva...
          </p>
        </div>
      </div>
    );
  }

  // ── Pantalla de Error (Token expirado o inválido) ──
  if (errorMessage) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col">
        {/* Cabecera */}
        <header className="bg-white border-b border-[#d3d3d3] py-4 px-4 sm:px-10">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <a href="/" className="flex flex-col group py-0.5">
              <div className="font-logo-nuevo text-3xl sm:text-4xl text-[#000000] leading-none">
                Nuevo Plaza
              </div>
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#808080] to-transparent my-1"></div>
              <span className="font-logo-sub text-[9.5px] sm:text-[10px] tracking-[0.3em] font-semibold text-[#36454f] uppercase text-center pl-[0.3em]">
                CONSULTORIOS
              </span>
            </a>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-lg border border-[#d3d3d3] shadow-sm text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-[#f8f9fa] border border-[#d3d3d3] text-[#36454f] flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#808080]">ACCESO CADUCADO</span>
              <h2 className="text-2xl font-bold text-[#000000] tracking-tight mt-1">Enlace No Disponible</h2>
            </div>
            <p className="text-xs text-[#36454f] leading-relaxed font-sans">{errorMessage}</p>
            <div className="pt-2">
              <a 
                href="/"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#000000] hover:bg-[#36454f] text-white font-mono text-xs uppercase tracking-wider rounded-md transition shadow-sm"
              >
                Volver a la Página Principal
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Pantalla de Confirmación Exitosa ──
  if (confirmedAppointment) {
    const clinicData = tokenData?.clinic || {};
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col">
        {/* Cabecera */}
        <header className="bg-white border-b border-[#d3d3d3] py-4 px-4 sm:px-10">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <a href="/" className="flex flex-col group py-0.5">
              <div className="font-logo-nuevo text-3xl sm:text-4xl text-[#000000] leading-none">
                Nuevo Plaza
              </div>
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#808080] to-transparent my-1"></div>
              <span className="font-logo-sub text-[9.5px] sm:text-[10px] tracking-[0.3em] font-semibold text-[#36454f] uppercase text-center pl-[0.3em]">
                CONSULTORIOS
              </span>
            </a>
            <span className="text-[11px] font-mono text-[#000000] font-bold bg-[#f0f0f0] border border-[#d3d3d3] px-3 py-1 rounded">
              COMPROBANTE OFICIAL
            </span>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4 py-12">
          <div className="w-full max-w-lg bg-white p-8 sm:p-10 rounded-lg border border-[#d3d3d3] shadow-sm text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#f8f9fa] border border-[#d3d3d3] text-[#000000] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#808080]">REGISTRO CONFIRMADO</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#000000] tracking-tight mt-1">¡Turno Reservado!</h2>
              <p className="text-xs text-[#808080] mt-1 font-sans">
                Tu cita ha sido registrada exitosamente en Nuevo Plaza Consultorios.
              </p>
            </div>

            {/* Ficha Resumen Monocromática */}
            <div className="p-5 rounded-md bg-[#fafafa] border border-[#d3d3d3] text-left space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-[#d3d3d3] pb-2">
                <span className="text-[#808080] uppercase tracking-wider text-[10px]">Paciente:</span>
                <span className="font-bold text-[#000000]">{name} (DNI: {tokenData?.dni})</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#d3d3d3] pb-2">
                <span className="text-[#808080] uppercase tracking-wider text-[10px]">Fecha y Hora:</span>
                <span className="font-bold text-[#000000] bg-[#f0f0f0] px-2 py-0.5 rounded border border-[#d3d3d3]">
                  {selectedDate} · {selectedTime} hs
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-[#d3d3d3] pb-2">
                <span className="text-[#808080] uppercase tracking-wider text-[10px]">Centro Médico:</span>
                <span className="font-semibold text-[#000000]">{clinicData.clinicName || 'Nuevo Plaza Consultorios'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#808080] uppercase tracking-wider text-[10px]">Ubicación:</span>
                <span className="text-[#36454f]">{clinicData.address || 'Belgrano 3108, Santa Fe'}</span>
              </div>
            </div>

            <p className="text-[11px] text-[#36454f] bg-[#f8f9fa] border border-[#d3d3d3] p-3 rounded-md text-left flex items-start gap-2 font-mono">
              <MessageCircle className="w-4 h-4 text-[#36454f] shrink-0 mt-0.5" />
              <span>
                Te enviamos la confirmación por <strong>WhatsApp</strong> y recibirás un recordatorio automático 24 hs antes de tu consulta.
              </span>
            </p>

            <a 
              href="/"
              className="block w-full py-3.5 bg-[#000000] hover:bg-[#36454f] text-white font-mono text-xs uppercase tracking-wider font-bold rounded-md transition shadow-sm"
            >
              Finalizar y Volver al Inicio
            </a>
          </div>
        </main>
      </div>
    );
  }

  // ── Vista Principal: Formulario de Reserva ──
  const clinicData = tokenData?.clinic || {};

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      
      {/* 1. Barra Superior Negra Estilo Boutique */}
      <div className="bg-[#000000] text-[#d3d3d3] text-xs py-2 px-4 sm:px-10 border-b border-[#36454f]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>{clinicData.address || 'Belgrano 3108, Santa Fe'}</span>
            <span className="hidden sm:inline text-[#808080]">·</span>
            <span className="hidden sm:inline text-[#808080]">{clinicData.workingHours || 'Lunes a Viernes de 08:00 a 20:00 hs'}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            {clinicData.whatsappNumber && (
              <span>WhatsApp: <strong className="text-white">{clinicData.whatsappNumber}</strong></span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Cabecera con Logotipo Original Nuevo Plaza */}
      <header className="bg-white border-b border-[#d3d3d3] py-4 px-4 sm:px-10 sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          
          {/* Logotipo fiel a la placa */}
          <a href="/" className="flex flex-col group py-0.5">
            <div className="font-logo-nuevo text-3xl sm:text-4xl text-[#000000] group-hover:text-[#36454f] transition-colors leading-none tracking-normal">
              Nuevo Plaza
            </div>
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#808080] to-transparent my-1"></div>
            <span className="font-logo-sub text-[9.5px] sm:text-[10px] tracking-[0.3em] font-semibold text-[#36454f] uppercase text-center pl-[0.3em]">
              CONSULTORIOS
            </span>
          </a>

          {/* Badge Monocromático de Validación */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#36454f] bg-[#f8f9fa] border border-[#d3d3d3] px-3 py-1.5 rounded-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold uppercase tracking-wider hidden sm:inline">Portal de Reserva Oficial</span>
            <span className="font-semibold uppercase tracking-wider sm:hidden">Reserva Oficial</span>
          </div>

        </div>
      </header>

      {/* 3. Contenedor de Formulario */}
      <main className="flex-1 max-w-4xl w-full mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-6">
        
        {/* Banner de Validación de Identidad */}
        <div className="bg-white border border-[#d3d3d3] rounded-lg p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#808080]">VALIDACIÓN DE PACIENTE</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#000000] font-bold bg-[#f0f0f0] border border-[#d3d3d3] px-2 py-0.5 rounded">
                <ShieldCheck className="w-3.5 h-3.5 text-[#36454f]" /> DNI {tokenData.dni}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#000000] tracking-tight">
              Agendá tu Turno en Línea
            </h1>
            <p className="text-xs text-[#808080] mt-0.5">
              {clinicData.clinicName || 'Nuevo Plaza Consultorios'} · Selección inmediata de horario
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#36454f] bg-[#f8f9fa] border border-[#d3d3d3] px-3.5 py-2 rounded-md shrink-0 self-start sm:self-auto">
            <Clock className="w-3.5 h-3.5 text-[#808080]" />
            <span>Enlace válido por 30 min</span>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white border border-[#d3d3d3] rounded-lg p-6 sm:p-8 space-y-8 shadow-sm">
          
          {/* Paso 1: Datos Personales */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#d3d3d3]">
              <span className="font-mono text-xs text-[#000000] font-bold">01.</span>
              <h3 className="font-mono text-xs font-bold tracking-widest text-[#000000] uppercase">
                Datos del Paciente
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono font-bold text-[#36454f] uppercase tracking-wider mb-1">
                  Nombre y Apellido *
                </label>
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className="w-full px-4 py-2.5 bg-white border border-[#d3d3d3] rounded-md text-sm text-[#000000] placeholder-[#808080] outline-none focus:border-[#000000] focus:ring-1 focus:ring-[#000000] transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-[#36454f] uppercase tracking-wider mb-1">
                  Obra Social / Prepaga
                </label>
                <input 
                  type="text"
                  value={healthInsurance}
                  onChange={e => setHealthInsurance(e.target.value)}
                  placeholder="Ej: Particular / IAPOS / OSDE"
                  className="w-full px-4 py-2.5 bg-white border border-[#d3d3d3] rounded-md text-sm text-[#000000] placeholder-[#808080] outline-none focus:border-[#000000] focus:ring-1 focus:ring-[#000000] transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono font-bold text-[#36454f] uppercase tracking-wider mb-1">
                  Número de WhatsApp para Recordatorios *
                </label>
                <input 
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Ej: +54 9 342 123-4567"
                  className="w-full px-4 py-2.5 bg-white border border-[#d3d3d3] rounded-md text-sm font-mono text-[#000000] placeholder-[#808080] outline-none focus:border-[#000000] focus:ring-1 focus:ring-[#000000] transition"
                />
                <p className="text-[11px] text-[#36454f] bg-[#f8f9fa] border border-[#d3d3d3] p-3 rounded-md mt-2 flex items-center gap-2 font-mono">
                  <ShieldCheck className="w-4 h-4 text-[#36454f] shrink-0" />
                  Te enviaremos la confirmación inmediata y el recordatorio automático 24hs antes por este WhatsApp.
                </p>
              </div>
            </div>
          </div>

          {/* Paso 2: Servicio / Motivo de Consulta */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#d3d3d3]">
              <span className="font-mono text-xs text-[#000000] font-bold">02.</span>
              <h3 className="font-mono text-xs font-bold tracking-widest text-[#000000] uppercase">
                Servicio o Especialidad
              </h3>
            </div>

            <select
              value={serviceId}
              onChange={e => setServiceId(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-[#d3d3d3] rounded-md text-sm text-[#000000] font-medium outline-none focus:border-[#000000] focus:ring-1 focus:ring-[#000000] transition cursor-pointer"
            >
              {tokenData.services?.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.durationMin} min)
                </option>
              ))}
            </select>
          </div>

          {/* Paso 3: Día y Horario */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#d3d3d3]">
              <span className="font-mono text-xs text-[#000000] font-bold">03.</span>
              <h3 className="font-mono text-xs font-bold tracking-widest text-[#000000] uppercase">
                Selección de Día y Horario
              </h3>
            </div>

            <div className="mb-4">
              <label className="block text-[11px] font-mono font-bold text-[#36454f] uppercase tracking-wider mb-1">
                Fecha del Turno
              </label>
              <input 
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full sm:w-64 px-4 py-2.5 bg-white border border-[#d3d3d3] rounded-md text-sm font-mono text-[#000000] outline-none focus:border-[#000000] focus:ring-1 focus:ring-[#000000] transition cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-[#36454f] uppercase tracking-wider mb-2">
                Horarios Disponibles
              </label>
              {loadingSlots ? (
                <p className="text-xs font-mono text-[#808080] py-4">Buscando horarios disponibles...</p>
              ) : availableSlots.length === 0 ? (
                <p className="text-xs text-[#36454f] bg-[#f8f9fa] border border-[#d3d3d3] p-4 rounded-md font-mono">
                  No hay horarios disponibles para la fecha seleccionada. Por favor elegí otro día.
                </p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {availableSlots.map(time => (
                    <button
                      type="button"
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2.5 px-3 rounded-md text-xs font-mono transition border ${
                        selectedTime === time
                          ? 'bg-[#000000] text-white border-[#000000] font-bold shadow-sm'
                          : 'bg-white text-[#36454f] border-[#d3d3d3] hover:border-[#000000] hover:text-[#000000]'
                      }`}
                    >
                      {time} hs
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Botón de Confirmación */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || !selectedTime}
              className="w-full py-4 bg-[#000000] hover:bg-[#36454f] text-white font-mono text-xs uppercase tracking-wider font-bold rounded-md transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            >
              {submitting ? 'Confirmando Reserva...' : 'Confirmar Reserva de Turno'}
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-center text-[11px] font-mono text-[#808080] mt-2">
              Al confirmar, tu turno quedará agendado inmediatamente en nuestro sistema.
            </p>
          </div>

        </form>

      </main>

      {/* Pie de página sutil */}
      <footer className="bg-white border-t border-[#d3d3d3] py-6 px-4 text-center">
        <p className="text-[11px] font-mono text-[#808080]">
          © {new Date().getFullYear()} NUEVO PLAZA CONSULTORIOS · SISTEMA DE GESTIÓN DE TURNOS
        </p>
      </footer>

    </div>
  );
}
